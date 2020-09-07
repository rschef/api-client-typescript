import { BigNumber } from 'bignumber.js';
import { networks, script as bscript, payments, crypto, Transaction } from 'bitcoinjs-lib';
import coinSelect from 'coinselect';
import fetch from 'node-fetch';
import { checkForInput } from 'bip174/src/lib/utils';
export const P2shP2wpkhScript = (pubkeyBuffer) => {
    // HASH160 len(20) {script} OP_EQUAL
    const addrHash = crypto.hash160(pubkeyBuffer);
    const script = 'a914' + addrHash.toString('hex') + '87';
    return Buffer.from(script, 'hex');
};
export const BTC_DIGITS = 8;
export const BTC_SATOSHI_MULTIPLIER = Math.pow(10, BTC_DIGITS);
export const FAKE_DESTINATION = '16JrGhLx5bcBSA34kew9V6Mufa4aXhFe9X';
export const NORMAL_TO_SATOSHI_MULTIPLIER = new BigNumber(10).pow(8);
export const calculateBtcFees = (amount, gasPrice, utxos) => {
    // since this is just used to format the tx to calculate the fee
    // there is no need for a real destination
    const transferAmount = Math.round(amount * BTC_SATOSHI_MULTIPLIER);
    // Calculate inputs and outputs using coin selection algorithm
    const { fee } = coinSelect(utxos.map(utxo => ({
        ...utxo,
        txId: utxo.txid,
        value: new BigNumber(utxo.value).times(BTC_SATOSHI_MULTIPLIER).toNumber()
    })), [{ address: FAKE_DESTINATION, value: transferAmount }], gasPrice);
    return new BigNumber(fee).div(NORMAL_TO_SATOSHI_MULTIPLIER);
};
export const calculateFeeRate = async () => {
    const fees = await fetch('https://bitcoinfees.earn.com/api/v1/fees/recommended');
    const data = await fees.json();
    return data.fastestFee;
};
export const networkFromName = (name) => {
    switch (name) {
        case 'TestNet':
            return networks.testnet;
        case 'MainNet':
            return networks.bitcoin;
        default:
            return networks.regtest;
    }
};
function checkScriptForPubkey(pubkey, script, action) {
    const pubkeyHash = crypto.hash160(pubkey);
    const decompiled = bscript.decompile(script);
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
export function getHashAndSighashType(inputs, inputIndex, pubkey, cache, sighashTypes) {
    const input = checkForInput(inputs, inputIndex);
    const { hash, sighashType, script } = getHashForSig(inputIndex, input, cache, sighashTypes);
    checkScriptForPubkey(pubkey, script, 'sign');
    return {
        hash,
        sighashType
    };
}
function sighashTypeToString(sighashType) {
    let text = // tslint:disable-next-line
     sighashType & Transaction.SIGHASH_ANYONECANPAY
        ? 'SIGHASH_ANYONECANPAY | '
        : '';
    // tslint:disable-next-line
    const sigMod = sighashType & 0x1f;
    switch (sigMod) {
        case Transaction.SIGHASH_ALL:
            text += 'SIGHASH_ALL';
            break;
        case Transaction.SIGHASH_SINGLE:
            text += 'SIGHASH_SINGLE';
            break;
        case Transaction.SIGHASH_NONE:
            text += 'SIGHASH_NONE';
            break;
    }
    return text;
}
function addNonWitnessTxCache(cache, input, inputIndex) {
    cache.__NON_WITNESS_UTXO_BUF_CACHE[inputIndex] = input.nonWitnessUtxo;
    const tx = Transaction.fromBuffer(input.nonWitnessUtxo);
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
const checkRedeemScript = scriptCheckerFactory(payments.p2sh, 'Redeem script');
const checkWitnessScript = scriptCheckerFactory(payments.p2wsh, 'Witness script');
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
const isP2WPKH = isPaymentFactory(payments.p2wpkh);
const isP2WSHScript = isPaymentFactory(payments.p2wsh);
export function getHashForSig(inputIndex, input, cache, sighashTypes) {
    const unsignedTx = cache.__TX;
    const sighashType = input.sighashType || Transaction.SIGHASH_ALL;
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
            const signingScript = payments.p2pkh({ hash: script.slice(2) }).output;
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
            const signingScript = payments.p2pkh({ hash: _script.slice(2) }).output;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnRjVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50L2J0Y1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUE7QUFDeEMsT0FBTyxFQUNMLFFBQVEsRUFDUixNQUFNLElBQUksT0FBTyxFQUNqQixRQUFRLEVBQ1IsTUFBTSxFQUNOLFdBQVcsRUFDWixNQUFNLGVBQWUsQ0FBQTtBQUN0QixPQUFPLFVBQVUsTUFBTSxZQUFZLENBQUE7QUFFbkMsT0FBTyxLQUFLLE1BQU0sWUFBWSxDQUFBO0FBRTlCLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQTtBQU9wRCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLFlBQW9CLEVBQVUsRUFBRTtJQUMvRCxvQ0FBb0M7SUFDcEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUM3QyxNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUE7SUFDdkQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUNuQyxDQUFDLENBQUE7QUFPRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFBO0FBQzNCLE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQzlELE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLG9DQUFvQyxDQUFBO0FBQ3BFLE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHLElBQUksU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUVwRSxNQUFNLENBQUMsTUFBTSxn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