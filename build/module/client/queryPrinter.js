import { print } from 'graphql/language/printer';
const previousPrintResults = new Map();
// Print will instantiate a new visitor every time. Lets cache previously printed queries.
export const gqlToString = (ast) => {
    if (previousPrintResults.has(ast)) {
        return previousPrintResults.get(ast);
    }
    const str = print(ast);
    previousPrintResults.set(ast, str);
    return str;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlQcmludGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudC9xdWVyeVByaW50ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBQ2hELE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxHQUFHLEVBQWUsQ0FBQTtBQUVuRCwwRkFBMEY7QUFDMUYsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBUSxFQUFVLEVBQUU7SUFDOUMsSUFBSSxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDakMsT0FBTyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDckM7SUFDRCxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFXLENBQUE7SUFDaEMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUNsQyxPQUFPLEdBQUcsQ0FBQTtBQUNaLENBQUMsQ0FBQSJ9