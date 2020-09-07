import { FiatCurrency } from '../../constants/currency';
import { Period } from '../../types';
export declare const GET_ACCOUNT_PORTFOLIO: any;
export interface GetAccountPortfolioParams {
    fiatSymbol?: FiatCurrency;
    period?: Period;
}
