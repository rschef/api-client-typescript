"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const fragments_1 = require("../queries/market/fragments");
exports.UPDATED_TICKERS = graphql_tag_1.default `
  subscription UpdatedTickers {
    updatedTickers {
      ...tickerFields
    }
  }
  ${fragments_1.TICKER_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlZFRpY2tlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3Vic2NyaXB0aW9ucy91cGRhdGVkVGlja2Vycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhEQUE2QjtBQUM3QiwyREFBNkQ7QUFDaEQsUUFBQSxlQUFlLEdBQUcscUJBQUcsQ0FBQTs7Ozs7O0lBTTlCLDJCQUFlO0NBQ2xCLENBQUEifQ==