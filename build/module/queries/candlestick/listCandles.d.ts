import { DateTime, CandleInterval } from '../../types';
export declare const LIST_CANDLES: any;
export interface ListCandlesParams {
    marketName: string;
    before?: DateTime;
    interval?: CandleInterval;
    limit?: number;
}
