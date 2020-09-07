"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlockchainError;
(function (BlockchainError) {
    BlockchainError["PREPARE_MOVEMENT_MUST_BE_CALLED_FIRST"] = "Prepare movement must be called first";
    BlockchainError["BLOCKCHAIN_BALANCE_OUT_OF_SYNC"] = "Blockchain balance out of sync";
    BlockchainError["WAITING_FOR_BALANCE_SYNC"] = "Waiting for balance sync";
    BlockchainError["BAD_NONCE"] = "Supplied nonce does not match expected nonce";
    BlockchainError["MISSING_SIGNATURES"] = "Missing signatures for open orders";
    BlockchainError["INSUFFICIENT_BALANCE"] = "Balance is insufficient";
    BlockchainError["WAITING_FOR_BLOCKCHAIN_TRANSACTION"] = "waiting for a transaction to make it to the blockchain";
    BlockchainError["INVALID_SIGNATURE"] = "Signature validation failed";
    BlockchainError["MOVEMENT_ALREADY_IN_PROGRESS"] = "A movement targeting the same asset is still in progress";
})(BlockchainError = exports.BlockchainError || (exports.BlockchainError = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZW1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudC9tb3ZlbWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFZLGVBVVg7QUFWRCxXQUFZLGVBQWU7SUFDekIsa0dBQStFLENBQUE7SUFDL0Usb0ZBQWlFLENBQUE7SUFDakUsd0VBQXFELENBQUE7SUFDckQsNkVBQTBELENBQUE7SUFDMUQsNEVBQXlELENBQUE7SUFDekQsbUVBQWdELENBQUE7SUFDaEQsZ0hBQTZGLENBQUE7SUFDN0Ysb0VBQWlELENBQUE7SUFDakQsNEdBQXlGLENBQUE7QUFDM0YsQ0FBQyxFQVZXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBVTFCIn0=