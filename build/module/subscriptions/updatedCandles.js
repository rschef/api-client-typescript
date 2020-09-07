import gql from 'graphql-tag';
import { CANDLE_FRAGMENT } from '../queries/candlestick/fragments/candleFragment';
export const UPDATED_CANDLES = gql `
  subscription UpdatedCandles(
    $interval: CandleInterval!
    $marketName: MarketName!
  ) {
    updatedCandles(marketName: $marketName, interval: $interval) {
      ...candleFields
    }
  }
  ${CANDLE_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlZENhbmRsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3Vic2NyaXB0aW9ucy91cGRhdGVkQ2FuZGxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUE7QUFDN0IsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlEQUFpRCxDQUFBO0FBRWpGLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUE7Ozs7Ozs7OztJQVM5QixlQUFlO0NBQ2xCLENBQUEifQ==