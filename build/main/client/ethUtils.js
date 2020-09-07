"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
const rlp = __importStar(require("rlp"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const currency_1 = require("../constants/currency");
const types_1 = require("../types");
function prefixWith0xIfNeeded(addr) {
    if (addr.startsWith('0x')) {
        return addr;
    }
    return '0x' + addr;
}
exports.prefixWith0xIfNeeded = prefixWith0xIfNeeded;
function serializeEthTx(tx) {
    return rlp
        .encode([
        ...tx.raw.slice(0, 6),
        ethereumjs_util_1.toBuffer(tx.getChainId()),
        ethereumjs_util_1.stripZeros(ethereumjs_util_1.toBuffer(0)),
        ethereumjs_util_1.stripZeros(ethereumjs_util_1.toBuffer(0))
    ])
        .toString('hex');
}
exports.serializeEthTx = serializeEthTx;
function setEthSignature(tx, sig) {
    tx.r = Buffer.from(sig.slice(0, 64), 'hex');
    tx.s = Buffer.from(sig.slice(64, 128), 'hex');
    tx.v = Buffer.from((parseInt(sig.slice(128, 130), 10) + (tx.getChainId() * 2 + 35)).toString(16), 'hex');
    if (!tx.verifySignature()) {
        throw new Error('Invalid signature');
    }
}
exports.setEthSignature = setEthSignature;
function transferExternalGetAmount(amount, asset, isMainNet) {
    switch (asset.blockchain) {
        case types_1.Blockchain.ETH:
            if (asset.symbol === 'eth') {
                return amount.toNumber();
            }
            else if (asset.symbol === currency_1.CryptoCurrency.USDC) {
                // Special case for USDC since backend serves incorrect blockchain precision for USDC
                // Note: This should be fixed in the backend but do not want to update assets/prod.csv
                // At this moment due to causing un-foreseen issues with that
                const exponent = isMainNet ? 6 : 18;
                return amount
                    .times(new bignumber_js_1.default(10).exponentiatedBy(exponent))
                    .toNumber();
            }
            else {
                if (asset.blockchainPrecision == null) {
                    throw new Error('Missing blockchainPrecision');
                }
                return amount.toNumber() * Math.pow(10, asset.blockchainPrecision);
            }
        default:
            throw new Error(`Invalid blockchain for getting amount: ${JSON.stringify(asset)}`);
    }
}
exports.transferExternalGetAmount = transferExternalGetAmount;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50L2V0aFV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLHFEQUFzRDtBQUN0RCx5Q0FBMEI7QUFDMUIsZ0VBQW9DO0FBRXBDLG9EQUFzRDtBQUN0RCxvQ0FBZ0Q7QUFFaEQsU0FBZ0Isb0JBQW9CLENBQUMsSUFBWTtJQUMvQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDekIsT0FBTyxJQUFJLENBQUE7S0FDWjtJQUNELE9BQU8sSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNwQixDQUFDO0FBTEQsb0RBS0M7QUFFRCxTQUFnQixjQUFjLENBQUMsRUFBa0I7SUFDL0MsT0FBTyxHQUFHO1NBQ1AsTUFBTSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JCLDBCQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3pCLDRCQUFVLENBQUMsMEJBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2Qiw0QkFBVSxDQUFDLDBCQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEIsQ0FBQztTQUNELFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNwQixDQUFDO0FBVEQsd0NBU0M7QUFFRCxTQUFnQixlQUFlLENBQUMsRUFBa0IsRUFBRSxHQUFXO0lBQzdELEVBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUMzQyxFQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDN0MsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUNoQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQ3ZFLEVBQUUsQ0FDSCxFQUNELEtBQUssQ0FDTixDQUFBO0lBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsRUFBRTtRQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUE7S0FDckM7QUFDSCxDQUFDO0FBYkQsMENBYUM7QUFFRCxTQUFnQix5QkFBeUIsQ0FDdkMsTUFBaUIsRUFDakIsS0FBZ0IsRUFDaEIsU0FBa0I7SUFFbEIsUUFBUSxLQUFLLENBQUMsVUFBVSxFQUFFO1FBQ3hCLEtBQUssa0JBQVUsQ0FBQyxHQUFHO1lBQ2pCLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxLQUFLLEVBQUU7Z0JBQzFCLE9BQU8sTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBO2FBQ3pCO2lCQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyx5QkFBYyxDQUFDLElBQUksRUFBRTtnQkFDL0MscUZBQXFGO2dCQUNyRixzRkFBc0Y7Z0JBQ3RGLDZEQUE2RDtnQkFDN0QsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtnQkFDbkMsT0FBTyxNQUFNO3FCQUNWLEtBQUssQ0FBQyxJQUFJLHNCQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3FCQUNsRCxRQUFRLEVBQUUsQ0FBQTthQUNkO2lCQUFNO2dCQUNMLElBQUksS0FBSyxDQUFDLG1CQUFtQixJQUFJLElBQUksRUFBRTtvQkFDckMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO2lCQUMvQztnQkFDRCxPQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQTthQUNuRTtRQUVIO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FDYiwwQ0FBMEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUNsRSxDQUFBO0tBQ0o7QUFDSCxDQUFDO0FBN0JELDhEQTZCQyJ9