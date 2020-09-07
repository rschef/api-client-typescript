"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const coinselect_1 = __importDefault(require("coinselect"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const utils_1 = require("bip174/src/lib/utils");
exports.P2shP2wpkhScript = (pubkeyBuffer) => {
    // HASH160 len(20) {script} OP_EQUAL
    const addrHash = bitcoinjs_lib_1.crypto.hash160(pubkeyBuffer);
    const script = 'a914' + addrHash.toString('hex') + '87';
    return Buffer.from(script, 'hex');
};
exports.BTC_DIGITS = 8;
exports.BTC_SATOSHI_MULTIPLIER = Math.pow(10, exports.BTC_DIGITS);
exports.FAKE_DESTINATION = '16JrGhLx5bcBSA34kew9V6Mufa4aXhFe9X';
exports.NORMAL_TO_SATOSHI_MULTIPLIER = new bignumber_js_1.BigNumber(10).pow(8);
exports.calculateBtcFees = (amount, gasPrice, utxos) => {
    // since this is just used to format the tx to calculate the fee
    // there is no need for a real destination
    const transferAmount = Math.round(amount * exports.BTC_SATOSHI_MULTIPLIER);
    // Calculate inputs and outputs using coin selection algorithm
    const { fee } = coinselect_1.default(utxos.map(utxo => ({
        ...utxo,
        txId: utxo.txid,
        value: new bignumber_js_1.BigNumber(utxo.value).times(exports.BTC_SATOSHI_MULTIPLIER).toNumber()
    })), [{ address: exports.FAKE_DESTINATION, value: transferAmount }], gasPrice);
    return new bignumber_js_1.BigNumber(fee).div(exports.NORMAL_TO_SATOSHI_MULTIPLIER);
};
exports.calculateFeeRate = async () => {
    const fees = await node_fetch_1.default('https://bitcoinfees.earn.com/api/v1/fees/recommended');
    const data = await fees.json();
    return data.fastestFee;
};
exports.networkFromName = (name) => {
    switch (name) {
        case 'TestNet':
            return bitcoinjs_lib_1.networks.testnet;
        case 'MainNet':
            return bitcoinjs_lib_1.networks.bitcoin;
        default:
            return bitcoinjs_lib_1.networks.regtest;
    }
};
function checkScriptForPubkey(pubkey, script, action) {
    const pubkeyHash = bitcoinjs_lib_1.crypto.hash160(pubkey);
    const decompiled = bitcoinjs_lib_1.script.decompile(script);
    if (decompiled === null) {
        throw new Error('Unknown script error');
    }
    const hasKey = decompiled.some(element => {
        if (typeof element === 'number') {
            return false;
        }
        return element.equals(pubkey) || element.equals(pubkeyHash);
    });
    if (!hasKey) {
        throw new Error(`Can not ${action} for this input with the key ${pubkey.toString('hex')}`);
    }
}
function getHashAndSighashType(inputs, inputIndex, pubkey, cache, sighashTypes) {
    const input = utils_1.checkForInput(inputs, inputIndex);
    const { hash, sighashType, script } = getHashForSig(inputIndex, input, cache, sighashTypes);
    checkScriptForPubkey(pubkey, script, 'sign');
    return {
        hash,
        sighashType
    };
}
exports.getHashAndSighashType = getHashAndSighashType;
function sighashTypeToString(sighashType) {
    let text = // tslint:disable-next-line
     sighashType & bitcoinjs_lib_1.Transaction.SIGHASH_ANYONECANPAY
        ? 'SIGHASH_ANYONECANPAY | '
        : '';
    // tslint:disable-next-line
    const sigMod = sighashType & 0x1f;
    switch (sigMod) {
        case bitcoinjs_lib_1.Transaction.SIGHASH_ALL:
            text += 'SIGHASH_ALL';
            break;
        case bitcoinjs_lib_1.Transaction.SIGHASH_SINGLE:
            text += 'SIGHASH_SINGLE';
            break;
        case bitcoinjs_lib_1.Transaction.SIGHASH_NONE:
            text += 'SIGHASH_NONE';
            break;
    }
    return text;
}
function addNonWitnessTxCache(cache, input, inputIndex) {
    cache.__NON_WITNESS_UTXO_BUF_CACHE[inputIndex] = input.nonWitnessUtxo;
    const tx = bitcoinjs_lib_1.Transaction.fromBuffer(input.nonWitnessUtxo);
    cache.__NON_WITNESS_UTXO_TX_CACHE[inputIndex] = tx;
    const self = cache;
    const selfIndex = inputIndex;
    delete input.nonWitnessUtxo;
    Object.defineProperty(input, 'nonWitnessUtxo', {
        enumerable: true,
        get() {
            const buf = self.__NON_WITNESS_UTXO_BUF_CACHE[selfIndex];
            const txCache = self.__NON_WITNESS_UTXO_TX_CACHE[selfIndex];
            if (buf !== undefined) {
                return buf;
            }
            else {
                const newBuf = txCache.toBuffer();
                self.__NON_WITNESS_UTXO_BUF_CACHE[selfIndex] = newBuf;
                return newBuf;
            }
        },
        set(data) {
            self.__NON_WITNESS_UTXO_BUF_CACHE[selfIndex] = data;
        }
    });
}
function nonWitnessUtxoTxFromCache(cache, input, inputIndex) {
    const c = cache.__NON_WITNESS_UTXO_TX_CACHE;
    if (!c[inputIndex]) {
        addNonWitnessTxCache(cache, input, inputIndex);
    }
    return c[inputIndex];
}
function scriptCheckerFactory(payment, paymentScriptName) {
    return (inputIndex, scriptPubKey, redeemScript) => {
        const redeemScriptOutput = payment({
            redeem: { output: redeemScript }
        }).output;
        if (!scriptPubKey.equals(redeemScriptOutput)) {
            throw new Error(`${paymentScriptName} for input #${inputIndex} doesn't match the scriptPubKey in the prevout`);
        }
    };
}
const checkRedeemScript = scriptCheckerFactory(bitcoinjs_lib_1.payments.p2sh, 'Redeem script');
const checkWitnessScript = scriptCheckerFactory(bitcoinjs_lib_1.payments.p2wsh, 'Witness script');
function isPaymentFactory(payment) {
    return (script) => {
        try {
            payment({ output: script });
            return true;
        }
        catch (err) {
            return false;
        }
    };
}
const isP2WPKH = isPaymentFactory(bitcoinjs_lib_1.payments.p2wpkh);
const isP2WSHScript = isPaymentFactory(bitcoinjs_lib_1.payments.p2wsh);
function getHashForSig(inputIndex, input, cache, sighashTypes) {
    const unsignedTx = cache.__TX;
    const sighashType = input.sighashType || bitcoinjs_lib_1.Transaction.SIGHASH_ALL;
    if (sighashTypes && sighashTypes.indexOf(sighashType) < 0) {
        const str = sighashTypeToString(sighashType);
        throw new Error(`Sighash type is not allowed. Retry the sign method passing the ` +
            `sighashTypes array of whitelisted types. Sighash type: ${str}`);
    }
    let hash;
    let script;
    if (input.nonWitnessUtxo) {
        const nonWitnessUtxoTx = nonWitnessUtxoTxFromCache(cache, input, inputIndex);
        const prevoutHash = unsignedTx.ins[inputIndex].hash;
        const utxoHash = nonWitnessUtxoTx.getHash();
        // If a non-witness UTXO is provided, its hash must match the hash specified in the prevout
        if (!prevoutHash.equals(utxoHash)) {
            throw new Error(`Non-witness UTXO hash for input #${inputIndex} doesn't match the hash specified in the prevout`);
        }
        const prevoutIndex = unsignedTx.ins[inputIndex].index;
        const prevout = nonWitnessUtxoTx.outs[prevoutIndex];
        if (input.redeemScript) {
            // If a redeemScript is provided, the scriptPubKey must be for that redeemScript
            checkRedeemScript(inputIndex, prevout.script, input.redeemScript);
            script = input.redeemScript;
        }
        else {
            script = prevout.script;
        }
        if (isP2WSHScript(script)) {
            if (!input.witnessScript) {
                throw new Error('Segwit input needs witnessScript if not P2WPKH');
            }
            checkWitnessScript(inputIndex, script, input.witnessScript);
            hash = unsignedTx.hashForWitnessV0(inputIndex, input.witnessScript, prevout.value, sighashType);
            script = input.witnessScript;
        }
        else if (isP2WPKH(script)) {
            // P2WPKH uses the P2PKH template for prevoutScript when signing
            const signingScript = bitcoinjs_lib_1.payments.p2pkh({ hash: script.slice(2) }).output;
            hash = unsignedTx.hashForWitnessV0(inputIndex, signingScript, prevout.value, sighashType);
        }
        else {
            hash = unsignedTx.hashForSignature(inputIndex, script, sighashType);
        }
    }
    else if (input.witnessUtxo) {
        let _script; // so we don't shadow the `let script` above
        if (input.redeemScript) {
            // If a redeemScript is provided, the scriptPubKey must be for that redeemScript
            checkRedeemScript(inputIndex, input.witnessUtxo.script, input.redeemScript);
            _script = input.redeemScript;
        }
        else {
            _script = input.witnessUtxo.script;
        }
        if (isP2WPKH(_script)) {
            // P2WPKH uses the P2PKH template for prevoutScript when signing
            const signingScript = bitcoinjs_lib_1.payments.p2pkh({ hash: _script.slice(2) }).output;
            hash = unsignedTx.hashForWitnessV0(inputIndex, signingScript, input.witnessUtxo.value, sighashType);
            script = _script;
        }
        else if (isP2WSHScript(_script)) {
            if (!input.witnessScript) {
                throw new Error('Segwit input needs witnessScript if not P2WPKH');
            }
            checkWitnessScript(inputIndex, _script, input.witnessScript);
            hash = unsignedTx.hashForWitnessV0(inputIndex, input.witnessScript, input.witnessUtxo.value, sighashType);
            // want to make sure the script we return is the actual meaningful script
            script = input.witnessScript;
        }
        else {
            throw new Error(`Input #${inputIndex} has witnessUtxo but non-segwit script: ` +
                `${_script.toString('hex')}`);
        }
    }
    else {
        throw new Error('Need a Utxo input item for signing');
    }
    return {
        script,
        sighashType,
        hash
    };
}
exports.getHashForSig = getHashForSig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnRjVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50L2J0Y1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0NBQXdDO0FBQ3hDLGlEQU1zQjtBQUN0Qiw0REFBbUM7QUFFbkMsNERBQThCO0FBRTlCLGdEQUFvRDtBQU92QyxRQUFBLGdCQUFnQixHQUFHLENBQUMsWUFBb0IsRUFBVSxFQUFFO0lBQy9ELG9DQUFvQztJQUNwQyxNQUFNLFFBQVEsR0FBRyxzQkFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUM3QyxNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUE7SUFDdkQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUNuQyxDQUFDLENBQUE7QUFPWSxRQUFBLFVBQVUsR0FBRyxDQUFDLENBQUE7QUFDZCxRQUFBLHNCQUFzQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLGtCQUFVLENBQUMsQ0FBQTtBQUNqRCxRQUFBLGdCQUFnQixHQUFHLG9DQUFvQyxDQUFBO0FBQ3ZELFFBQUEsNEJBQTRCLEdBQUcsSUFBSSx3QkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUV2RCxRQUFBLGdCQUFnQixHQUFHLENBQzlCLE1BQWMsRUFDZCxRQUFnQixFQUNoQixLQUFjLEVBQ0gsRUFBRTtJQUNiLGdFQUFnRTtJQUNoRSwwQ0FBMEM7SUFDMUMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsOEJBQXNCLENBQUMsQ0FBQTtJQUVsRSw4REFBOEQ7SUFDOUQsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLG9CQUFVLENBQ3hCLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFB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