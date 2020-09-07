import gql from 'graphql-tag';
import { ORDER_PLACED_FRAGMENT } from './fragments';
export const PLACE_LIMIT_ORDER_MUTATION = gql `
  mutation placeLimitOrder(
    $affiliateDeveloperCode: AffiliateDeveloperCode
    $payload: PlaceLimitOrderParams!
    $signature: Signature!
  ) {
    placeLimitOrder(
      affiliateDeveloperCode: $affiliateDeveloperCode
      payload: $payload
      signature: $signature
    ) {
      ...orderPlacedFields
    }
  }
  ${ORDER_PLACED_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2VMaW1pdE9yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL211dGF0aW9ucy9vcmRlcnMvcGxhY2VMaW1pdE9yZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQTtBQUU3QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxhQUFhLENBQUE7QUFFbkQsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQUcsR0FBRyxDQUFBOzs7Ozs7Ozs7Ozs7OztJQWN6QyxxQkFBcUI7Q0FDeEIsQ0FBQSJ9