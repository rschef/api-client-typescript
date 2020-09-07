"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.COMPLETE_BTC_TRANSACTION_SIGNATURES = graphql_tag_1.default `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGVCVENUcmFuc2FjaXRvblNpZ25hdHVyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbXV0YXRpb25zL21wYy9jb21wbGV0ZUJUQ1RyYW5zYWNpdG9uU2lnbmF0dXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhEQUE2QjtBQUVoQixRQUFBLG1DQUFtQyxHQUFHLHFCQUFHLENBQUE7Ozs7Ozs7Ozs7OztDQVlyRCxDQUFBIn0=