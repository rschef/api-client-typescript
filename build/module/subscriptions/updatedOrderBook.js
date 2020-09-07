import gql from 'graphql-tag';
import { ORDERBOOK_FRAGMENT } from '../queries/market/fragments';
export const UPDATED_ORDER_BOOK = gql `
  subscription UpdatedOrderBook($marketName: MarketName!) {
    updatedOrderBook(marketName: $marketName) {
      ...marketOrderbookFields
    }
  }
  ${ORDERBOOK_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlZE9yZGVyQm9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdWJzY3JpcHRpb25zL3VwZGF0ZWRPcmRlckJvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0sYUFBYSxDQUFBO0FBQzdCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFBO0FBQ2hFLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQTs7Ozs7O0lBTWpDLGtCQUFrQjtDQUNyQixDQUFBIn0=