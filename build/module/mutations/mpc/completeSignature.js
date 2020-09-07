import gql from 'graphql-tag';
export var CompletePayloadSignatureType;
(function (CompletePayloadSignatureType) {
    CompletePayloadSignatureType["Blockchain"] = "BLOCKCHAIN";
    CompletePayloadSignatureType["Movement"] = "MOVEMENT";
})(CompletePayloadSignatureType || (CompletePayloadSignatureType = {}));
export const COMPLETE_PAYLOAD_SIGNATURE = gql `
  mutation completePayloadSignature(
    $blockchain: Blockchain!
    $payload: Base16!
    $type: CompletePayloadSignatureType!
    $public_key: Base16!
    $r: Base16!
    $signature: Base16!
  ) {
    completePayloadSignature(
      blockchain: $blockchain
      payload: $payload
      publicKey: $public_key
      r: $r
      type: $type
      signature: $signature
    ) {
      signature
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGVTaWduYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbXV0YXRpb25zL21wYy9jb21wbGV0ZVNpZ25hdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUE7QUFHN0IsTUFBTSxDQUFOLElBQVksNEJBR1g7QUFIRCxXQUFZLDRCQUE0QjtJQUN0Qyx5REFBeUIsQ0FBQTtJQUN6QixxREFBcUIsQ0FBQTtBQUN2QixDQUFDLEVBSFcsNEJBQTRCLEtBQTVCLDRCQUE0QixRQUd2QztBQUVELE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUFHLEdBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FvQjVDLENBQUEifQ==