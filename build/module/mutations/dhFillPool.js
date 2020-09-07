import gql from 'graphql-tag';
export const DH_FIIL_POOL = gql `
  mutation dhFillRPool($blockchain: Blockchain!, $dhPublics: [Base16]!) {
    dhFillPool(dhPublics: $dhPublics, blockchain: $blockchain)
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGhGaWxsUG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tdXRhdGlvbnMvZGhGaWxsUG9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUE7QUFHN0IsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQTs7OztDQUk5QixDQUFBIn0=