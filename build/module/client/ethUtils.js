import { toBuffer, stripZeros } from 'ethereumjs-util';
import * as rlp from 'rlp';
import BigNumber from 'bignumber.js';
import { CryptoCurrency } from '../constants/currency';
import { Blockchain } from '../types';
export function prefixWith0xIfNeeded(addr) {
    if (addr.startsWith('0x')) {
        return addr;
    }
    return '0x' + addr;
}
export function serializeEthTx(tx) {
    return rlp
        .encode([
        ...tx.raw.slice(0, 6),
        toBuffer(tx.getChainId()),
        stripZeros(toBuffer(0)),
        stripZeros(toBuffer(0))
    ])
        .toString('hex');
}
export function setEthSignature(tx, sig) {
    tx.r = Buffer.from(sig.slice(0, 64), 'hex');
    tx.s = Buffer.from(sig.slice(64, 128), 'hex');
    tx.v = Buffer.from((parseInt(sig.slice(128, 130), 10) + (tx.getChainId() * 2 + 35)).toString(16), 'hex');
    if (!tx.verifySignature()) {
        throw new Error('Invalid signature');
    }
}
export function transferExternalGetAmount(amount, asset, isMainNet) {
    switch (asset.blockchain) {
        case Blockchain.ETH:
            if (asset.symbol === 'eth') {
                return amount.toNumber();
            }
            else if (asset.symbol === CryptoCurrency.USDC) {
                // Special case for USDC since backend serves incorrect blockchain precision for USDC
                // Note: This should be fixed in the backend but do not want to update assets/prod.csv
                // At this moment due to causing un-foreseen issues with that
                const exponent = isMainNet ? 6 : 18;
                return amount
                    .times(new BigNumber(10).exponentiatedBy(exponent))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50L2V0aFV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDdEQsT0FBTyxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFDMUIsT0FBTyxTQUFTLE1BQU0sY0FBYyxDQUFBO0FBRXBDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQTtBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFhLE1BQU0sVUFBVSxDQUFBO0FBRWhELE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxJQUFZO0lBQy9DLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN6QixPQUFPLElBQUksQ0FBQTtLQUNaO0lBQ0QsT0FBTyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLEVBQWtCO0lBQy9DLE9BQU8sR0FBRztTQUNQLE1BQU0sQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyQixRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4QixDQUFDO1NBQ0QsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3BCLENBQUM7QUFFRCxNQUFNLFVBQVUsZUFBZSxDQUFDLEVBQWtCLEVBQUUsR0FBVztJQUM3RCxFQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDM0MsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQzdDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDaEIsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUN2RSxFQUFFLENBQ0gsRUFDRCxLQUFLLENBQ04sQ0FBQTtJQUVELElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLEVBQUU7UUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0tBQ3JDO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSx5QkFBeUIsQ0FDdkMsTUFBaUIsRUFDakIsS0FBZ0IsRUFDaEIsU0FBa0I7SUFFbEIsUUFBUSxLQUFLLENBQUMsVUFBVSxFQUFFO1FBQ3hCLEtBQUssVUFBVSxDQUFDLEdBQUc7WUFDakIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLEtBQUssRUFBRTtnQkFDMUIsT0FBTyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUE7YUFDekI7aUJBQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLGNBQWMsQ0FBQyxJQUFJLEVBQUU7Z0JBQy9DLHFGQUFxRjtnQkFDckYsc0ZBQXNGO2dCQUN0Riw2REFBNkQ7Z0JBQzdELE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7Z0JBQ25DLE9BQU8sTUFBTTtxQkFDVixLQUFLLENBQUMsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3FCQUNsRCxRQUFRLEVBQUUsQ0FBQTthQUNkO2lCQUFNO2dCQUNMLElBQUksS0FBSyxDQUFDLG1CQUFtQixJQUFJLElBQUksRUFBRTtvQkFDckMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO2lCQUMvQztnQkFDRCxPQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQTthQUNuRTtRQUVIO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FDYiwwQ0FBMEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUNsRSxDQUFBO0tBQ0o7QUFDSCxDQUFDIn0=