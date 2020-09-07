"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.GET_ACCOUNT_ADDRESS = graphql_tag_1.default `
  query getAccountAddress($payload: GetAccountAddressParams!) {
    getAccountAddress(payload: $payload) {
      address
      currency
      vins {
        n
        txid
        value {
          amount
          currency
        }
      }
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QWNjb3VudEFkZHJlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcXVlcmllcy9hY2NvdW50L2dldEFjY291bnRBZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQTZCO0FBR2hCLFFBQUEsbUJBQW1CLEdBQUcscUJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7O0NBZXJDLENBQUEifQ==