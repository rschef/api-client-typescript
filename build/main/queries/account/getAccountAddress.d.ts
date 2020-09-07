import { CryptoCurrency } from '../../constants/currency';
export declare const GET_ACCOUNT_ADDRESS: any;
export interface GetAccountAddressParams {
    payload: {
        currency: CryptoCurrency;
    };
}
export interface GetAccountAddressResult {
    getAccountAddress: {
        address: string;
        currency: CryptoCurrency;
        vins: Array<{
            n: number;
            txid: string;
            value: {
                amount: string;
                currency: string;
            };
        }>;
    };
}
