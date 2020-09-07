import gql from 'graphql-tag';
import { TRADE_FRAGMENT } from '../queries/market/fragments/tradeFragment';
export const NEW_TRADES = gql `
  subscription NewTrades($marketName: MarketName!) {
    newTrades(marketName: $marketName) {
      ...tradeFields
    }
  }
  ${TRADE_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3VHJhZGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N1YnNjcmlwdGlvbnMvbmV3VHJhZGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQTtBQUM3QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUE7QUFDMUUsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQTs7Ozs7O0lBTXpCLGNBQWM7Q0FDakIsQ0FBQSJ9