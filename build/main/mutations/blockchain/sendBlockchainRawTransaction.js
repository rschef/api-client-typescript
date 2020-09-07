"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.SEND_BLOCKCHAIN_RAW_TRANSACTION = graphql_tag_1.default `
  mutation sendBlockchainRawTransaction(
    $payload: SendBlockchainRawTransactionParams!
    $signature: Signature!
  ) {
    sendBlockchainRawTransaction(payload: $payload, signature: $signature)
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZEJsb2NrY2hhaW5SYXdUcmFuc2FjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tdXRhdGlvbnMvYmxvY2tjaGFpbi9zZW5kQmxvY2tjaGFpblJhd1RyYW5zYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQTZCO0FBYWhCLFFBQUEsK0JBQStCLEdBQUcscUJBQUcsQ0FBQTs7Ozs7OztDQU9qRCxDQUFBIn0=