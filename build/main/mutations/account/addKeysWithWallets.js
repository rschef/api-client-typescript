"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.ADD_KEYS_WITH_WALLETS_MUTATION = graphql_tag_1.default `
  mutation addKeysWithWallets(
    $encryptedSecretKey: String!
    $encryptedSecretKeyNonce: String!
    $encryptedSecretKeyTag: String!
    $signaturePublicKey: Base16!
    $wallets: [WalletInput!]!
  ) {
    addKeysWithWallets(
      encryptedSecretKey: $encryptedSecretKey
      encryptedSecretKeyNonce: $encryptedSecretKeyNonce
      encryptedSecretKeyTag: $encryptedSecretKeyTag
      signaturePublicKey: $signaturePublicKey
      wallets: $wallets
    ) {
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
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkS2V5c1dpdGhXYWxsZXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL211dGF0aW9ucy9hY2NvdW50L2FkZEtleXNXaXRoV2FsbGV0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhEQUE2QjtBQUVoQixRQUFBLDhCQUE4QixHQUFHLHFCQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQWlDaEQsQ0FBQSJ9