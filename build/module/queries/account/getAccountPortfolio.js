import gql from 'graphql-tag';
import { ACCOUNT_PORTFOLIO_BALANCE_FRAGMENT, GRAPH_POINT_FRAGMENT, ACCOUNT_PORTFOLIO_TOTAL_FRAGMENT } from './fragments';
export const GET_ACCOUNT_PORTFOLIO = gql `
  query getAccountPortfolio($payload: GetAccountPortfolioParams!) {
    getAccountPortfolio(payload: $payload) {
      balances {
        ...portfolioBalanceFields
      }
      graph {
        ...graphPointFields
      }
      total {
        ...accountPortfolioTotalFields
      }
    }
  }
  ${ACCOUNT_PORTFOLIO_BALANCE_FRAGMENT}
  ${GRAPH_POINT_FRAGMENT}
  ${ACCOUNT_PORTFOLIO_TOTAL_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QWNjb3VudFBvcnRmb2xpby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9xdWVyaWVzL2FjY291bnQvZ2V0QWNjb3VudFBvcnRmb2xpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUE7QUFFN0IsT0FBTyxFQUNMLGtDQUFrQyxFQUNsQyxvQkFBb0IsRUFDcEIsZ0NBQWdDLEVBQ2pDLE1BQU0sYUFBYSxDQUFBO0FBSXBCLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLEdBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7SUFjcEMsa0NBQWtDO0lBQ2xDLG9CQUFvQjtJQUNwQixnQ0FBZ0M7Q0FDbkMsQ0FBQSJ9