import gql from 'graphql-tag';
export const ORDER_PLACED_FRAGMENT = gql `
  fragment orderPlacedFields on OrderPlaced {
    id
    status
    ordersTillSignState
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJQbGFjZWRGcmFnbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tdXRhdGlvbnMvb3JkZXJzL2ZyYWdtZW50cy9vcmRlclBsYWNlZEZyYWdtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQTtBQUU3QixNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLENBQUE7Ozs7OztDQU12QyxDQUFBIn0=