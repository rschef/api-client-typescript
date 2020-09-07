"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.UPDATE_MOVEMENT_MUTATION = graphql_tag_1.default `
  mutation updateMovement(
    $payload: UpdateMovementParams!
    $signature: Signature!
  ) {
    updateMovement(payload: $payload, signature: $signature) {
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
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlTW92ZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbXV0YXRpb25zL21vdmVtZW50cy91cGRhdGVNb3ZlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhEQUE2QjtBQUdoQixRQUFBLHdCQUF3QixHQUFHLHFCQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBMEIxQyxDQUFBIn0=