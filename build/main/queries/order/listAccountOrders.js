"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const fragments_1 = require("./fragments");
const fragments_2 = require("../market/fragments");
exports.LIST_ACCOUNT_ORDERS = graphql_tag_1.default `
  query ListAccountOrders($payload: ListAccountOrdersParams!) {
    listAccountOrders(payload: $payload) {
      next
      orders {
        ...orderFields
      }
    }
  }
  ${fragments_1.ORDER_FRAGMENT}
`;
exports.LIST_ACCOUNT_ORDERS_WITH_TRADES = graphql_tag_1.default `
  query ListAccountOrders($payload: ListAccountOrdersParams!) {
    listAccountOrders(payload: $payload) {
      next
      orders {
        ...orderFields
        trades {
          ...tradeFields
        }
      }
    }
  }
  ${fragments_1.ORDER_FRAGMENT}
  ${fragments_2.TRADE_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdEFjY291bnRPcmRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcXVlcmllcy9vcmRlci9saXN0QWNjb3VudE9yZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhEQUE2QjtBQUU3QiwyQ0FBNEM7QUFDNUMsbURBQW9EO0FBUXZDLFFBQUEsbUJBQW1CLEdBQUcscUJBQUcsQ0FBQTs7Ozs7Ozs7O0lBU2xDLDBCQUFjO0NBQ2pCLENBQUE7QUFFWSxRQUFBLCtCQUErQixHQUFHLHFCQUFHLENBQUE7Ozs7Ozs7Ozs7OztJQVk5QywwQkFBYztJQUNkLDBCQUFjO0NBQ2pCLENBQUEifQ==