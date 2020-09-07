"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const tradeFragment_1 = require("../queries/market/fragments/tradeFragment");
exports.NEW_ACCOUNT_TRADES = graphql_tag_1.default `
  subscription newAccountTrades($payload: NewAccountTradesParams!) {
    newAccountTrades(payload: $payload) {
      ...tradeFields
    }
  }
  ${tradeFragment_1.TRADE_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3QWNjb3VudFRyYWRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdWJzY3JpcHRpb25zL25ld0FjY291bnRUcmFkZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4REFBNkI7QUFDN0IsNkVBQTBFO0FBQzdELFFBQUEsa0JBQWtCLEdBQUcscUJBQUcsQ0FBQTs7Ozs7O0lBTWpDLDhCQUFjO0NBQ2pCLENBQUEifQ==