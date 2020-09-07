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
export class ApolloError extends Error {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBvbGxvRXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50L0Fwb2xsb0Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLHdEQUF3RDtBQUN4RCxtREFBbUQ7QUFDbkQsd0RBQXdEO0FBQ3hELG9EQUFvRDtBQUNwRCxNQUFNLG9CQUFvQixHQUFHLENBQUMsR0FBZ0IsRUFBRSxFQUFFO0lBQ2hELElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQTtJQUNoQixvRUFBb0U7SUFDcEUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDdEUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUEwQixFQUFFLEVBQUU7WUFDdkQsTUFBTSxZQUFZLEdBQUcsWUFBWTtnQkFDL0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPO2dCQUN0QixDQUFDLENBQUMsMEJBQTBCLENBQUE7WUFDOUIsT0FBTyxJQUFJLGtCQUFrQixZQUFZLElBQUksQ0FBQTtRQUMvQyxDQUFDLENBQUMsQ0FBQTtLQUNIO0lBRUQsSUFBSSxHQUFHLENBQUMsWUFBWSxFQUFFO1FBQ3BCLE9BQU8sSUFBSSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7S0FDL0Q7SUFFRCw0Q0FBNEM7SUFDNUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQ3BDLE9BQU8sT0FBTyxDQUFBO0FBQ2hCLENBQUMsQ0FBQTtBQUVELE1BQU0sT0FBTyxXQUFZLFNBQVEsS0FBSztJQVVwQyw2REFBNkQ7SUFDN0QsK0RBQStEO0lBQy9ELHNEQUFzRDtJQUN0RCxZQUFZLEVBQ1YsYUFBYSxFQUNiLFlBQVksRUFDWixZQUFZLEVBQ1osU0FBUyxFQU1WO1FBQ0MsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxJQUFJLEVBQUUsQ0FBQTtRQUN4QyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksSUFBSSxJQUFJLENBQUE7UUFFeEMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzFDO2FBQU07WUFDTCxJQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQTtTQUM1QjtRQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUl6QjtRQUFDLElBQVksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQTtJQUNsRCxDQUFDO0NBQ0YifQ==