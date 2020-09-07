import gql from 'graphql-tag';
import { ACCOUNT_BALANCE_FRAGMENT } from './fragments';
export const LIST_ACCOUNT_BALANCES = gql `
  query listAccountBalances($payload: ListAccountBalancesParams!) {
    listAccountBalances(payload: $payload) {
      ...accountBalanceFields
    }
  }
  ${ACCOUNT_BALANCE_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdEFjY291bnRCYWxhbmNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9xdWVyaWVzL2FjY291bnQvbGlzdEFjY291bnRCYWxhbmNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUE7QUFFN0IsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sYUFBYSxDQUFBO0FBRXRELE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLEdBQUcsQ0FBQTs7Ozs7O0lBTXBDLHdCQUF3QjtDQUMzQixDQUFBIn0=