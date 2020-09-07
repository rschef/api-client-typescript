import gql from 'graphql-tag';
export const UPDATE_MOVEMENT_MUTATION = gql `
  mutation updateMovement(
    $payload: UpdateMovementParams!
    $signature: Signature!
  ) {
    updateMovement(payload: $payload, signature: $signature) {
      address
      confirmations
      id
      currency
      quantity {
        amount
        currency
      }
      receivedAt
      status
      publicKey
      signature
      type
      nonce
      blockchain
      transactionPayload
      transactionHash
      fee
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlTW92ZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbXV0YXRpb25zL21vdmVtZW50cy91cGRhdGVNb3ZlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUE7QUFHN0IsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUcsR0FBRyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTBCMUMsQ0FBQSJ9