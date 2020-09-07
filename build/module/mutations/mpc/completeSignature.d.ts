import { Blockchain } from '@neon-exchange/nash-protocol';
export declare enum CompletePayloadSignatureType {
    Blockchain = "BLOCKCHAIN",
    Movement = "MOVEMENT"
}
export declare const COMPLETE_PAYLOAD_SIGNATURE: any;
export interface CompletePayloadSignatureArgs {
    blockchain: Blockchain;
    payload: string;
    public_key: string;
    r: string;
    signature: string;
    type: CompletePayloadSignatureType;
}
export interface CompletePayloadSignatureResult {
    signature: string;
}
