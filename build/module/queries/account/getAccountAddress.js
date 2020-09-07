import gql from 'graphql-tag';
export const GET_ACCOUNT_ADDRESS = gql `
  query getAccountAddress($payload: GetAccountAddressParams!) {
    getAccountAddress(payload: $payload) {
      address
      currency
      vins {
        n
        txid
        value {
          amount
          currency
        }
      }
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QWNjb3VudEFkZHJlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcXVlcmllcy9hY2NvdW50L2dldEFjY291bnRBZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQTtBQUc3QixNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxHQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7OztDQWVyQyxDQUFBIn0=