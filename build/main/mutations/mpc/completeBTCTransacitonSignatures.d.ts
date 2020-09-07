export declare const COMPLETE_BTC_TRANSACTION_SIGNATURES: any;
export interface CompleteBtcTransactionSignaturesArgs {
    inputPresigs: Array<{
        r: string;
        signature: string;
        amount: number;
    }>;
    payload: string;
    publicKey: string;
}
export interface CompleteBtcTransactionSignaturesResult {
    completeBtcPayloadSignature: string[];
}
