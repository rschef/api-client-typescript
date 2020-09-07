"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const fragments_1 = require("../queries/market/fragments");
exports.UPDATED_ORDER_BOOK = graphql_tag_1.default `
  subscription UpdatedOrderBook($marketName: MarketName!) {
    updatedOrderBook(marketName: $marketName) {
      ...marketOrderbookFields
    }
  }
  ${fragments_1.ORDERBOOK_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlZE9yZGVyQm9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdWJzY3JpcHRpb25zL3VwZGF0ZWRPcmRlckJvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4REFBNkI7QUFDN0IsMkRBQWdFO0FBQ25ELFFBQUEsa0JBQWtCLEdBQUcscUJBQUcsQ0FBQTs7Ozs7O0lBTWpDLDhCQUFrQjtDQUNyQixDQUFBIn0=