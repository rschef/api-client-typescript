"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const candleFragment_1 = require("../queries/candlestick/fragments/candleFragment");
exports.UPDATED_CANDLES = graphql_tag_1.default `
  subscription UpdatedCandles(
    $interval: CandleInterval!
    $marketName: MarketName!
  ) {
    updatedCandles(marketName: $marketName, interval: $interval) {
      ...candleFields
    }
  }
  ${candleFragment_1.CANDLE_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlZENhbmRsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3Vic2NyaXB0aW9ucy91cGRhdGVkQ2FuZGxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhEQUE2QjtBQUM3QixvRkFBaUY7QUFFcEUsUUFBQSxlQUFlLEdBQUcscUJBQUcsQ0FBQTs7Ozs7Ozs7O0lBUzlCLGdDQUFlO0NBQ2xCLENBQUEifQ==