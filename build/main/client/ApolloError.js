"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Sets the error message on this error according to the
// the GraphQL and network errors that are present.
// If the error message has already been set through the
// constructor or otherwise, this function is a nop.
const generateErrorMessage = (err) => {
    let message = '';
    // If we have GraphQL errors present, add that to the error message.
    if (Array.isArray(err.graphQLErrors) && err.graphQLErrors.length !== 0) {
        err.graphQLErrors.forEach((graphQLError) => {
            const errorMessage = graphQLError
                ? graphQLError.message
                : 'Error message not found.';
            message += `GraphQL error: ${errorMessage}\n`;
        });
    }
    if (err.networkError) {
        message += 'Network error: ' + err.networkError.message + '\n';
    }
    // strip newline from the end of the message
    message = message.replace(/\n$/, '');
    return message;
};
class ApolloError extends Error {
    // Constructs an instance of ApolloError given a GraphQLError
    // or a network error. Note that one of these has to be a valid
    // value or the constructed error will be meaningless.
    constructor({ graphQLErrors, networkError, errorMessage, extraInfo }) {
        super(errorMessage);
        this.graphQLErrors = graphQLErrors || [];
        this.networkError = networkError || null;
        if (!errorMessage) {
            this.message = generateErrorMessage(this);
        }
        else {
            this.message = errorMessage;
        }
        this.extraInfo = extraInfo;
        this.__proto__ = ApolloError.prototype;
    }
}
exports.ApolloError = ApolloError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBvbGxvRXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50L0Fwb2xsb0Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsd0RBQXdEO0FBQ3hELG1EQUFtRDtBQUNuRCx3REFBd0Q7QUFDeEQsb0RBQW9EO0FBQ3BELE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxHQUFnQixFQUFFLEVBQUU7SUFDaEQsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFBO0lBQ2hCLG9FQUFvRTtJQUNwRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN0RSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQTBCLEVBQUUsRUFBRTtZQUN2RCxNQUFNLFlBQVksR0FBRyxZQUFZO2dCQUMvQixDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU87Z0JBQ3RCLENBQUMsQ0FBQywwQkFBMEIsQ0FBQTtZQUM5QixPQUFPLElBQUksa0JBQWtCLFlBQVksSUFBSSxDQUFBO1FBQy9DLENBQUMsQ0FBQyxDQUFBO0tBQ0g7SUFFRCxJQUFJLEdBQUcsQ0FBQyxZQUFZLEVBQUU7UUFDcEIsT0FBTyxJQUFJLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtLQUMvRDtJQUVELDRDQUE0QztJQUM1QyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDcEMsT0FBTyxPQUFPLENBQUE7QUFDaEIsQ0FBQyxDQUFBO0FBRUQsTUFBYSxXQUFZLFNBQVEsS0FBSztJQVVwQyw2REFBNkQ7SUFDN0QsK0RBQStEO0lBQy9ELHNEQUFzRDtJQUN0RCxZQUFZLEVBQ1YsYUFBYSxFQUNiLFlBQVksRUFDWixZQUFZLEVBQ1osU0FBUyxFQU1WO1FBQ0MsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxJQUFJLEVBQUUsQ0FBQTtRQUN4QyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksSUFBSSxJQUFJLENBQUE7UUFFeEMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzFDO2FBQU07WUFDTCxJQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQTtTQUM1QjtRQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUl6QjtRQUFDLElBQVksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQTtJQUNsRCxDQUFDO0NBQ0Y7QUF4Q0Qsa0NBd0NDIn0=