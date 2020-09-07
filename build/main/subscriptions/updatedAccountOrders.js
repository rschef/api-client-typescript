"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const fragments_1 = require("../queries/order/fragments");
exports.UPDATED_ACCOUNT_ORDERS = graphql_tag_1.default `
  subscription UpdatedAccountOrders($payload: UpdatedAccountOrdersParams!) {
    updatedAccountOrders(payload: $payload) {
      ...orderFields
    }
  }
  ${fragments_1.ORDER_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlZEFjY291bnRPcmRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3Vic2NyaXB0aW9ucy91cGRhdGVkQWNjb3VudE9yZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhEQUE2QjtBQUM3QiwwREFBMkQ7QUFDOUMsUUFBQSxzQkFBc0IsR0FBRyxxQkFBRyxDQUFBOzs7Ozs7SUFNckMsMEJBQWM7Q0FDakIsQ0FBQSJ9