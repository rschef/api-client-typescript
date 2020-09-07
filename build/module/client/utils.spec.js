import { checkMandatoryParams } from './utils';
describe('checkMandatoryParams', () => {
    it('should return an error when trying to call a function without mandatory params', () => {
        const email = undefined;
        const password = undefined;
        expect(() => checkMandatoryParams({
            email,
            password,
            Type: 'string'
        })).toThrow();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnQvdXRpbHMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFFOUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtJQUNwQyxFQUFFLENBQUMsZ0ZBQWdGLEVBQUUsR0FBRyxFQUFFO1FBQ3hGLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQTtRQUN2QixNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUE7UUFDMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUNWLG9CQUFvQixDQUFDO1lBQ25CLEtBQUs7WUFDTCxRQUFRO1lBQ1IsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDLENBQ0gsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUNiLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEifQ==