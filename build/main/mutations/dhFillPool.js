"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.DH_FIIL_POOL = graphql_tag_1.default `
  mutation dhFillRPool($blockchain: Blockchain!, $dhPublics: [Base16]!) {
    dhFillPool(dhPublics: $dhPublics, blockchain: $blockchain)
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGhGaWxsUG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tdXRhdGlvbnMvZGhGaWxsUG9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhEQUE2QjtBQUdoQixRQUFBLFlBQVksR0FBRyxxQkFBRyxDQUFBOzs7O0NBSTlCLENBQUEifQ==