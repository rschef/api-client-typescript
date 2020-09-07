"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.PREPARE_MOVEMENT_MUTATION = graphql_tag_1.default `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZU1vdmVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL211dGF0aW9ucy9tb3ZlbWVudHMvcHJlcGFyZU1vdmVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQTZCO0FBU2hCLFFBQUEseUJBQXlCLEdBQUcscUJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBcUIzQyxDQUFBIn0=