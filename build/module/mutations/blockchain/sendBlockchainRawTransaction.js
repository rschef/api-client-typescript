import gql from 'graphql-tag';
export const SEND_BLOCKCHAIN_RAW_TRANSACTION = gql `
  mutation sendBlockchainRawTransaction(
    $payload: SendBlockchainRawTransactionParams!
    $signature: Signature!
  ) {
    sendBlockchainRawTransaction(payload: $payload, signature: $signature)
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZEJsb2NrY2hhaW5SYXdUcmFuc2FjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tdXRhdGlvbnMvYmxvY2tjaGFpbi9zZW5kQmxvY2tjaGFpblJhd1RyYW5zYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQTtBQWE3QixNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBRyxHQUFHLENBQUE7Ozs7Ozs7Q0FPakQsQ0FBQSJ9