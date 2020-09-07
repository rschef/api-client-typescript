import { MovementTypeDeposit, MovementTypeWithdrawal } from '@neon-exchange/nash-protocol';
import { ClientSignedState } from '../stateSyncing/fragments';
import { CurrencyAmount, Signature, Blockchain } from '../../types';
export declare const PREPARE_MOVEMENT_MUTATION: any;
export interface TransactionElement {
    blockchain: Blockchain;
    digest: string;
}
export interface PrepareMovement {
    recycledOrders: ClientSignedState[];
    nonce: number;
    transactionElements: TransactionElement[];
    fees: CurrencyAmount;
}
export interface PrepareMovementData {
    prepareMovement: PrepareMovement;
}
export interface PrepareMovementVariables {
    payload: {
        address: string;
        quantity: CurrencyAmount;
        timestamp: number;
        type: typeof MovementTypeDeposit | typeof MovementTypeWithdrawal;
    };
    signature: Signature;
}
