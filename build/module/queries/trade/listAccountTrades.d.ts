import { PaginationCursor } from '../../types';
export declare const LIST_ACCOUNT_TRADES: any;
export interface ListAccountTradeParams {
    before?: PaginationCursor;
    limit?: number;
    marketName?: string;
}
