import { PaginationCursor } from '../../types';
export declare const LIST_TRADES: any;
export interface ListTradeParams {
    marketName: string;
    limit?: number;
    before?: PaginationCursor;
}
