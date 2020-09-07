"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
describe('checkMandatoryParams', () => {
    it('should return an error when trying to call a function without mandatory params', () => {
        const email = undefined;
        const password = undefined;
        expect(() => utils_1.checkMandatoryParams({
            email,
            password,
            Type: 'string'
        })).toThrow();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnQvdXRpbHMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUE4QztBQUU5QyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxnRkFBZ0YsRUFBRSxHQUFHLEVBQUU7UUFDeEYsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFBO1FBQ3ZCLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQTtRQUMxQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQ1YsNEJBQW9CLENBQUM7WUFDbkIsS0FBSztZQUNMLFFBQVE7WUFDUixJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUMsQ0FDSCxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ2IsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSJ9