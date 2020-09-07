import gql from 'graphql-tag';
export const ADD_MOVEMENT_FRAGMENT = gql `
  fragment addMovementFields on Movement {
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
    type
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkTW92ZW1lbnRGcmFnbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tdXRhdGlvbnMvbW92ZW1lbnRzL2ZyYWdtZW50cy9hZGRNb3ZlbWVudEZyYWdtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQTtBQUs3QixNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FzQnZDLENBQUEifQ==