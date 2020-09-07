import gql from 'graphql-tag';
import { ORDER_FRAGMENT } from '../queries/order/fragments';
export const UPDATED_ACCOUNT_ORDERS = gql `
  subscription UpdatedAccountOrders($payload: UpdatedAccountOrdersParams!) {
    updatedAccountOrders(payload: $payload) {
      ...orderFields
    }
  }
  ${ORDER_FRAGMENT}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlZEFjY291bnRPcmRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3Vic2NyaXB0aW9ucy91cGRhdGVkQWNjb3VudE9yZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUE7QUFDN0IsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFBO0FBQzNELE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLEdBQUcsQ0FBQTs7Ozs7O0lBTXJDLGNBQWM7Q0FDakIsQ0FBQSJ9