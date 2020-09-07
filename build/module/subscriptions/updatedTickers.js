import gql from 'graphql-tag';
import { TICKER_FRAGMENT } from '../queries/market/fragments';
export const UPDATED_TICKERS = gql `
  subscription UpdatedTickers {
    updatedTickers {
      ...tickerFields
    }
  }
  ${TICKER_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlZFRpY2tlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3Vic2NyaXB0aW9ucy91cGRhdGVkVGlja2Vycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUE7QUFDN0IsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFBO0FBQzdELE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUE7Ozs7OztJQU05QixlQUFlO0NBQ2xCLENBQUEifQ==