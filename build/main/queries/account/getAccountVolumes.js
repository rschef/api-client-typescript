"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.GET_ACCOUNT_VOLUMES = graphql_tag_1.default `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QWNjb3VudFZvbHVtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcXVlcmllcy9hY2NvdW50L2dldEFjY291bnRWb2x1bWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQTZCO0FBRWhCLFFBQUEsbUJBQW1CLEdBQUcscUJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXNFckMsQ0FBQSJ9