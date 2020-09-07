import { MovementType, MovementStatus } from '../../types';
import { CryptoCurrencies } from '../../constants/currency';
export declare const LIST_MOVEMENTS: any;
export interface ListMovementsParams {
    currency?: CryptoCurrencies | string;
    status?: MovementStatus;
    type?: MovementType;
}
