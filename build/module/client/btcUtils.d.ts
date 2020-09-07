/// <reference types="node" />
import { BigNumber } from 'bignumber.js';
import { networks, Transaction } from 'bitcoinjs-lib';
import { PsbtInput } from 'bip174/src/lib/interfaces';
export declare const P2shP2wpkhScript: (pubkeyBuffer: Buffer) => Buffer;
export interface Utxos {
    txid: string;
    vout: number;
    value: string;
    height: number;
}
export declare const BTC_DIGITS = 8;
export declare const BTC_SATOSHI_MULTIPLIER: number;
export declare const FAKE_DESTINATION = "16JrGhLx5bcBSA34kew9V6Mufa4aXhFe9X";
export declare const NORMAL_TO_SATOSHI_MULTIPLIER: BigNumber;
export declare const calculateBtcFees: (amount: number, gasPrice: number, utxos: Utxos[]) => BigNumber;
export declare const calculateFeeRate: () => Promise<number>;
export declare const networkFromName: (name: string) => networks.Network;
export declare function getHashAndSighashType(inputs: PsbtInput[], inputIndex: number, pubkey: Buffer, cache: PsbtCache, sighashTypes: number[]): {
    hash: Buffer;
    sighashType: number;
};
interface PsbtCache {
    __NON_WITNESS_UTXO_TX_CACHE: Transaction[];
    __NON_WITNESS_UTXO_BUF_CACHE: Buffer[];
    __TX_IN_CACHE: {
        [index: string]: number;
    };
    __TX: Transaction;
    __FEE_RATE?: number;
    __FEE?: number;
    __EXTRACTED_TX?: Transaction;
}
export declare function getHashForSig(inputIndex: number, input: PsbtInput, cache: PsbtCache, sighashTypes?: number[]): {
    script: Buffer;
    hash: Buffer;
    sighashType: number;
};
export {};
