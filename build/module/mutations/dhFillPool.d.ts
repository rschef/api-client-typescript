import { Blockchain } from '@neon-exchange/nash-protocol';
export declare const DH_FIIL_POOL: any;
export interface DHFillPoolArgs {
    dhPublics: string[];
    blockchain: Blockchain;
}
export interface DHFillPoolResp {
    dhFillPool: string[];
}
