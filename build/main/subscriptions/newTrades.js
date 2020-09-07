"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const tradeFragment_1 = require("../queries/market/fragments/tradeFragment");
exports.NEW_TRADES = graphql_tag_1.default `
  subscription NewTrades($marketName: MarketName!) {
    newTrades(marketName: $marketName) {
      ...tradeFields
    }
  }
  ${tradeFragment_1.TRADE_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3VHJhZGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N1YnNjcmlwdGlvbnMvbmV3VHJhZGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQTZCO0FBQzdCLDZFQUEwRTtBQUM3RCxRQUFBLFVBQVUsR0FBRyxxQkFBRyxDQUFBOzs7Ozs7SUFNekIsOEJBQWM7Q0FDakIsQ0FBQSJ9