import { Transaction as EthTransaction } from 'ethereumjs-tx';
import BigNumber from 'bignumber.js';
import { AssetData } from '../types';
export declare function prefixWith0xIfNeeded(addr: string): string;
export declare function serializeEthTx(tx: EthTransaction): string;
export declare function setEthSignature(tx: EthTransaction, sig: string): void;
export declare function transferExternalGetAmount(amount: BigNumber, asset: AssetData, isMainNet: boolean): number;
