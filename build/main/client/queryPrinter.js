"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const printer_1 = require("graphql/language/printer");
const previousPrintResults = new Map();
// Print will instantiate a new visitor every time. Lets cache previously printed queries.
exports.gqlToString = (ast) => {
    if (previousPrintResults.has(ast)) {
        return previousPrintResults.get(ast);
    }
    const str = printer_1.print(ast);
    previousPrintResults.set(ast, str);
    return str;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlQcmludGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudC9xdWVyeVByaW50ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzREFBZ0Q7QUFDaEQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFBO0FBRW5ELDBGQUEwRjtBQUM3RSxRQUFBLFdBQVcsR0FBRyxDQUFDLEdBQVEsRUFBVSxFQUFFO0lBQzlDLElBQUksb0JBQW9CLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ2pDLE9BQU8sb0JBQW9CLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3JDO0lBQ0QsTUFBTSxHQUFHLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBVyxDQUFBO0lBQ2hDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDbEMsT0FBTyxHQUFHLENBQUE7QUFDWixDQUFDLENBQUEifQ==