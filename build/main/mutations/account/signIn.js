"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.SIGN_IN_MUTATION = graphql_tag_1.default `
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password, duration: LONG) {
      account {
        creatingAccount
        email
        encryptedSecretKey
        encryptedSecretKeyTag
        encryptedSecretKeyNonce
        id
        loginErrorCount
        twoFactor
        twoFactorErrorCount
        verified
        wallets {
          address
          blockchain
          chainIndex
          publicKey
        }
      }
      serverEncryptionKey
      twoFaRequired
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbkluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL211dGF0aW9ucy9hY2NvdW50L3NpZ25Jbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhEQUE2QjtBQUVoQixRQUFBLGdCQUFnQixHQUFHLHFCQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0F5QmxDLENBQUEifQ==