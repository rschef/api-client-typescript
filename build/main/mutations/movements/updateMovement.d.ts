import { Signature, Movement, MovementStatus } from '../../types';
export declare const UPDATE_MOVEMENT_MUTATION: any;
export interface UpdateMovementData {
    updateMovement: Movement;
}
export interface UpdateMovementVariables {
    payload: {
        movementId: string;
        transactionHash?: string;
        transactionPayload?: string;
        status?: MovementStatus;
        timestamp: number;
        fee: string;
    };
    signature: Signature;
}
