import gql from 'graphql-tag';
export const ADD_KEYS_WITH_WALLETS_MUTATION = gql `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkS2V5c1dpdGhXYWxsZXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL211dGF0aW9ucy9hY2NvdW50L2FkZEtleXNXaXRoV2FsbGV0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUE7QUFFN0IsTUFBTSxDQUFDLE1BQU0sOEJBQThCLEdBQUcsR0FBRyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FpQ2hELENBQUEifQ==