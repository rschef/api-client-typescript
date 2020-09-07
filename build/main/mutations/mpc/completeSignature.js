"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
var CompletePayloadSignatureType;
(function (CompletePayloadSignatureType) {
    CompletePayloadSignatureType["Blockchain"] = "BLOCKCHAIN";
    CompletePayloadSignatureType["Movement"] = "MOVEMENT";
})(CompletePayloadSignatureType = exports.CompletePayloadSignatureType || (exports.CompletePayloadSignatureType = {}));
exports.COMPLETE_PAYLOAD_SIGNATURE = graphql_tag_1.default `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGVTaWduYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbXV0YXRpb25zL21wYy9jb21wbGV0ZVNpZ25hdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhEQUE2QjtBQUc3QixJQUFZLDRCQUdYO0FBSEQsV0FBWSw0QkFBNEI7SUFDdEMseURBQXlCLENBQUE7SUFDekIscURBQXFCLENBQUE7QUFDdkIsQ0FBQyxFQUhXLDRCQUE0QixHQUE1QixvQ0FBNEIsS0FBNUIsb0NBQTRCLFFBR3ZDO0FBRVksUUFBQSwwQkFBMEIsR0FBRyxxQkFBRyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQW9CNUMsQ0FBQSJ9