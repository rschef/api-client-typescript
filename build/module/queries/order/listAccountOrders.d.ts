import { PaginationCursor, OrderBuyOrSell, DateTime, OrderStatus, OrderType } from '../../types';
export declare const LIST_ACCOUNT_ORDERS: any;
export declare const LIST_ACCOUNT_ORDERS_WITH_TRADES: any;
export interface ListAccountOrderParams {
    before?: PaginationCursor;
    buyOrSell?: OrderBuyOrSell;
    limit?: number;
    marketName?: string;
    rangeStart?: DateTime;
    rangeStop?: DateTime;
    status?: [OrderStatus];
    type?: [OrderType];
    shouldIncludeTrades?: boolean;
}
