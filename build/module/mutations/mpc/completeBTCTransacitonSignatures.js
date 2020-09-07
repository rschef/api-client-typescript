import gql from 'graphql-tag';
export const COMPLETE_BTC_TRANSACTION_SIGNATURES = gql `
  mutation completeBtcPayloadSignature(
    $payload: Base16!
    $publicKey: Base16!
    $inputPresigs: [InputPresig!]!
  ) {
    completeBtcPayloadSignature(
      payload: $payload
      publicKey: $publicKey
      inputPresigs: $inputPresigs
    )
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGVCVENUcmFuc2FjaXRvblNpZ25hdHVyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbXV0YXRpb25zL21wYy9jb21wbGV0ZUJUQ1RyYW5zYWNpdG9uU2lnbmF0dXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUE7QUFFN0IsTUFBTSxDQUFDLE1BQU0sbUNBQW1DLEdBQUcsR0FBRyxDQUFBOzs7Ozs7Ozs7Ozs7Q0FZckQsQ0FBQSJ9