import gql from 'graphql-tag';
export const PREPARE_MOVEMENT_MUTATION = gql `
  mutation prepareMovement(
    $payload: PrepareMovementParams!
    $signature: Signature!
  ) {
    prepareMovement(payload: $payload, signature: $signature) {
      recycledOrders {
        blockchain
        message
      }
      nonce
      transactionElements {
        blockchain
        digest
      }
      fees {
        currency
        amount
      }
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZU1vdmVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL211dGF0aW9ucy9tb3ZlbWVudHMvcHJlcGFyZU1vdmVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQTtBQVM3QixNQUFNLENBQUMsTUFBTSx5QkFBeUIsR0FBRyxHQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXFCM0MsQ0FBQSJ9