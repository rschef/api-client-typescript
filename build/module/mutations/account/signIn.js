import gql from 'graphql-tag';
export const SIGN_IN_MUTATION = gql `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbkluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL211dGF0aW9ucy9hY2NvdW50L3NpZ25Jbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUE7QUFFN0IsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBeUJsQyxDQUFBIn0=