import gql from 'graphql-tag';
export const GET_ACCOUNT_VOLUMES = gql `
  query GetAccountVolumes($payload: GetAccountVolumesParams!) {
    getAccountVolumes(payload: $payload) {
      daily {
        accountLimit {
          amount
          currency
        }

        accountSpend {
          amount
          currency
        }

        accountVolume {
          amount
          currency
        }

        exchangeVolume {
          amount
          currency
        }
      }
      makerFeeRate
      monthly {
        accountLimit {
          amount
          currency
        }

        accountSpend {
          amount
          currency
        }

        accountVolume {
          amount
          currency
        }

        exchangeVolume {
          amount
          currency
        }
      }
      takerFeeRate
      yearly {
        accountLimit {
          amount
          currency
        }

        accountSpend {
          amount
          currency
        }

        accountVolume {
          amount
          currency
        }

        exchangeVolume {
          amount
          currency
        }
      }
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QWNjb3VudFZvbHVtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcXVlcmllcy9hY2NvdW50L2dldEFjY291bnRWb2x1bWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQTtBQUU3QixNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxHQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FzRXJDLENBQUEifQ==