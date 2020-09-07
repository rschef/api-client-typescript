import gql from 'graphql-tag';
import { TRADE_FRAGMENT } from '../queries/market/fragments/tradeFragment';
export const NEW_ACCOUNT_TRADES = gql `
  subscription newAccountTrades($payload: NewAccountTradesParams!) {
    newAccountTrades(payload: $payload) {
      ...tradeFields
    }
  }
  ${TRADE_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3QWNjb3VudFRyYWRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdWJzY3JpcHRpb25zL25ld0FjY291bnRUcmFkZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0sYUFBYSxDQUFBO0FBQzdCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQTtBQUMxRSxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUE7Ozs7OztJQU1qQyxjQUFjO0NBQ2pCLENBQUEifQ==