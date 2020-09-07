"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.ADD_MOVEMENT_FRAGMENT = graphql_tag_1.default `
  fragment addMovementFields on Movement {
    address
    confirmations
    id
    currency
    quantity {
      amount
      currency
    }
    receivedAt
    status
    publicKey
    signature
    type
    nonce
    blockchain
    transactionPayload
    transactionHash
    fee
    type
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkTW92ZW1lbnRGcmFnbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tdXRhdGlvbnMvbW92ZW1lbnRzL2ZyYWdtZW50cy9hZGRNb3ZlbWVudEZyYWdtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQTZCO0FBS2hCLFFBQUEscUJBQXFCLEdBQUcscUJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXNCdkMsQ0FBQSJ9