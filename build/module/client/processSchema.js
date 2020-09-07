import { validate, specifiedRules, isNonNullType, isListType } from 'graphql';
import { readFile } from 'fs';
import { buildSchema } from 'graphql/utilities';
import { LIST_MARKETS_QUERY } from '../queries/market/listMarkets';
import { GET_MARKET_QUERY } from '../queries/market/getMarket';
import { LIST_ACCOUNT_TRANSACTIONS } from '../queries/account/listAccountTransactions';
import { LIST_ACCOUNT_ORDERS, LIST_ACCOUNT_ORDERS_WITH_TRADES } from '../queries/order/listAccountOrders';
import { LIST_ACCOUNT_TRADES } from '../queries/trade/listAccountTrades';
import { GET_ACCOUNT_ADDRESS } from '../queries/account/getAccountAddress';
import { LIST_ACCOUNT_BALANCES } from '../queries/account/listAccountBalances';
import { LIST_MOVEMENTS } from '../queries/movement/listMovements';
import { GET_ACCOUNT_BALANCE } from '../queries/account/getAccountBalance';
import { GET_ACCOUNT_ORDER } from '../queries/order/getAccountOrder';
import { GET_MOVEMENT } from '../queries/movement/getMovement';
import { GET_TICKER } from '../queries/market/getTicker';
import { CANCEL_ORDER_MUTATION } from '../mutations/orders/cancelOrder';
import { CANCEL_ALL_ORDERS_MUTATION } from '../mutations/orders/cancelAllOrders';
import { USER_2FA_LOGIN_MUTATION } from '../mutations/account/twoFactorLoginMutation';
import { SIGN_IN_MUTATION } from '../mutations/account/signIn';
import { ADD_KEYS_WITH_WALLETS_MUTATION } from '../mutations/account/addKeysWithWallets';
import { LIST_CANDLES } from '../queries/candlestick/listCandles';
import { LIST_TICKERS } from '../queries/market/listTickers';
import { LIST_TRADES } from '../queries/market/listTrades';
import { GET_ORDERBOOK } from '../queries/market/getOrderBook';
import { PLACE_LIMIT_ORDER_MUTATION } from '../mutations/orders/placeLimitOrder';
import { PLACE_MARKET_ORDER_MUTATION } from '../mutations/orders/placeMarketOrder';
import { PLACE_STOP_LIMIT_ORDER_MUTATION } from '../mutations/orders/placeStopLimitOrder';
import { PLACE_STOP_MARKET_ORDER_MUTATION } from '../mutations/orders/placeStopMarketOrder';
import { ADD_MOVEMENT_MUTATION } from '../mutations/movements/addMovementMutation';
import { PREPARE_MOVEMENT_MUTATION } from '../mutations/movements/prepareMovement';
import { UPDATE_MOVEMENT_MUTATION } from '../mutations/movements/updateMovement';
import { GET_ACCOUNT_PORTFOLIO } from '../queries/account/getAccountPortfolio';
import { LIST_ASSETS_QUERY } from '../queries/asset/listAsset';
import { NEW_ACCOUNT_TRADES } from '../subscriptions/newAccountTrades';
import { UPDATED_ACCOUNT_ORDERS } from '../subscriptions/updatedAccountOrders';
import { UPDATED_ORDER_BOOK } from '../subscriptions/updatedOrderBook';
import { NEW_TRADES } from '../subscriptions/newTrades';
import { UPDATED_TICKERS } from '../subscriptions/updatedTickers';
import { UPDATED_CANDLES } from '../subscriptions/updatedCandles';
import { DH_FIIL_POOL } from '../mutations/dhFillPool';
import { GET_ASSETS_NONCES_QUERY } from '../queries/nonces/getAssetsNonces';
import { SYNC_STATES_MUTATION } from '../mutations/stateSyncing/syncStatesMutation';
import { SIGN_STATES_MUTATION } from '../mutations/stateSyncing/signStatesMutation';
import { COMPLETE_PAYLOAD_SIGNATURE } from '../mutations/mpc/completeSignature';
import { COMPLETE_BTC_TRANSACTION_SIGNATURES } from '../mutations/mpc/completeBTCTransacitonSignatures';
import { SEND_BLOCKCHAIN_RAW_TRANSACTION } from '../mutations/blockchain/sendBlockchainRawTransaction';
const queries = {
    LIST_ACCOUNT_TRADES,
    GET_ACCOUNT_ADDRESS,
    LIST_ACCOUNT_BALANCES,
    LIST_MOVEMENTS,
    GET_ACCOUNT_BALANCE,
    GET_ACCOUNT_ORDER,
    GET_MOVEMENT,
    GET_TICKER,
    CANCEL_ORDER_MUTATION,
    CANCEL_ALL_ORDERS_MUTATION,
    USER_2FA_LOGIN_MUTATION,
    SIGN_IN_MUTATION,
    ADD_KEYS_WITH_WALLETS_MUTATION,
    LIST_CANDLES,
    LIST_TICKERS,
    LIST_TRADES,
    GET_ORDERBOOK,
    PLACE_LIMIT_ORDER_MUTATION,
    PLACE_MARKET_ORDER_MUTATION,
    PLACE_STOP_LIMIT_ORDER_MUTATION,
    PLACE_STOP_MARKET_ORDER_MUTATION,
    ADD_MOVEMENT_MUTATION,
    PREPARE_MOVEMENT_MUTATION,
    UPDATE_MOVEMENT_MUTATION,
    GET_ACCOUNT_PORTFOLIO,
    LIST_ASSETS_QUERY,
    NEW_ACCOUNT_TRADES,
    UPDATED_ACCOUNT_ORDERS,
    UPDATED_ORDER_BOOK,
    NEW_TRADES,
    UPDATED_TICKERS,
    UPDATED_CANDLES,
    DH_FIIL_POOL,
    GET_ASSETS_NONCES_QUERY,
    SYNC_STATES_MUTATION,
    SIGN_STATES_MUTATION,
    COMPLETE_PAYLOAD_SIGNATURE,
    COMPLETE_BTC_TRANSACTION_SIGNATURES,
    SEND_BLOCKCHAIN_RAW_TRANSACTION,
    LIST_MARKETS_QUERY,
    GET_MARKET_QUERY,
    LIST_ACCOUNT_TRANSACTIONS,
    LIST_ACCOUNT_ORDERS,
    LIST_ACCOUNT_ORDERS_WITH_TRADES
};
const knownFragments = new Map();
const collectFragments = ast => {
    ast.definitions.forEach(def => {
        if (def.kind === 'FragmentDefinition') {
            knownFragments.set(def.name.value, def);
        }
    });
};
async function run() {
    const src = await new Promise((resolve, reject) => readFile('./schema.graphql', 'utf-8', (err, buff) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(buff);
        }
    }));
    const schema = buildSchema(src);
    const queryType = schema.getQueryType();
    const mutationType = schema.getMutationType();
    const subscriptionType = schema.getSubscriptionType();
    const baseTypes = {
        ID: 'string',
        UUID4: 'string',
        Int: 'number',
        Float: 'number',
        MarketName: 'string',
        Base16: 'string',
        CurrencyNumber: 'string',
        PaginationCursor: 'string',
        CurrencySymbol: 'string',
        DateTime: 'string',
        Boolean: 'boolean',
        Json: 'object',
        String: 'string',
        Date: 'string',
        NaiveDateTime: 'string'
    };
    const mapTypeName = name => {
        if (baseTypes[name]) {
            return baseTypes[name];
        }
        const t = schema.getType(name);
        if (t) {
            if (t.astNode && t.astNode.kind === 'EnumTypeDefinition') {
                return name;
            }
            if (t.astNode && t.astNode.kind === 'InputValueDefinition') {
                return name;
            }
            if (t.astNode && t.astNode.kind === 'InputObjectTypeDefinition') {
                return name;
            }
            throw new Error('Unknown kind ' + name);
        }
        throw new Error('Invalid type ' + name);
    };
    const getTypeName = (type, notNull = false) => {
        if (type.kind === 'ListType') {
            if (notNull) {
                return 'Array<' + getTypeName(type.type) + '>';
            }
            return 'GQLNullable<Array<' + getTypeName(type.type) + '>>';
        }
        if (type.kind === 'NonNullType') {
            return getTypeName(type.type, true);
        }
        if (type.kind === 'NamedType') {
            if (notNull) {
                return mapTypeName(type.name.value || type.name);
            }
            return 'GQLNullable<' + mapTypeName(type.name.value || type.name) + '>';
        }
        throw new Error('Fail');
    };
    // Walks a query
    // Queries consist of an OperationDefinition query/mutation
    // an initial SelectionSet, the '{ fieldA, fieldB, ... }'
    // then either fields [aliasA]: FieldA
    // or a recursive selectionSet.
    //
    // Fields or Selections may be nonNull / arrays, but never both.
    // Null types for arrays are just empty arrays in gql.
    function walkSelectionSet(schemaType, node, indent = '  ', printTypename = true) {
        switch (node.kind) {
            case 'FragmentSpread':
                const fragmentName = node.name.value;
                if (!knownFragments.has(fragmentName)) {
                    throw new Error("Cannot spread fragment '" +
                        fragmentName +
                        "', fragment not defined");
                }
                const fragmentDef = knownFragments.get(fragmentName);
                const fragmentType = fragmentDef.typeCondition.name.value;
                const type = schema.getType(fragmentType);
                walkSelectionSet(type, fragmentDef.selectionSet, indent, false);
                break;
            case 'SelectionSet':
                const inlineQueries = node.selections.filter(sel => sel.kind === 'InlineFragment');
                const inlineFragments = {};
                inlineQueries.forEach(s => {
                    inlineFragments[s.typeCondition.name.value] =
                        inlineFragments[s.typeCondition.name.value] || [];
                    inlineFragments[s.typeCondition.name.value].push(s);
                });
                const baseFields = node.selections.filter(sel => sel.kind !== 'InlineFragment' ||
                    (sel.kind === 'Field' &&
                        sel.name.value === '__typename' &&
                        !sel.name.alias));
                const fragments = Object.keys(inlineFragments);
                if (baseFields.length === 0 &&
                    fragments.length === 0 &&
                    printTypename) {
                    // console.log(indent + '__typename?: string')
                }
                if (baseFields.length !== 0 && fragments.length === 0) {
                    // if (printTypename) {
                    //   console.log(indent + '__typename?: string')
                    // }
                    node.selections.forEach(n => walkSelectionSet(schemaType, n, indent));
                    return;
                }
                fragments.forEach((typeName, i) => {
                    const ty = schema.getType(typeName);
                    if (i !== 0) {
                        console.log(indent + '} | {');
                    }
                    console.log(indent + "  __typename: '" + typeName + "'");
                    baseFields.forEach(n => walkSelectionSet(schemaType, n, indent + '  ', false));
                    inlineFragments[typeName].forEach(fragment => {
                        const { selectionSet } = fragment;
                        walkSelectionSet(ty, selectionSet, indent + '  ', false);
                    });
                });
                break;
            case 'Field': {
                const { name, alias, selectionSet } = node;
                const fieldName = name.value;
                const field = schemaType.getFields()[fieldName];
                let fieldType = field.type;
                const aliasName = alias ? alias.value : fieldName;
                const prefix = [];
                while (true) {
                    if (isNonNullType(fieldType) ||
                        prefix[prefix.length - 1] === 'Array<') {
                        fieldType = fieldType.ofType;
                    }
                    else {
                        prefix.push('GQLNullable<');
                    }
                    if (isListType(fieldType)) {
                        prefix.push('Array<');
                        fieldType = fieldType.ofType;
                    }
                    if (fieldType.ofType == null) {
                        break;
                    }
                }
                const prefixStr = prefix.join('');
                const postfixStr = '>'.repeat(prefix.length);
                // No furtherSelectionSets means we are at a leaf node / field
                if (!selectionSet) {
                    console.log(indent +
                        aliasName +
                        ': ' +
                        prefixStr +
                        mapTypeName(fieldType) +
                        postfixStr);
                }
                else {
                    console.log(indent + aliasName + ': ' + prefixStr + '{');
                    walkSelectionSet(fieldType, selectionSet, indent + '  ');
                    console.log(indent + '}' + postfixStr);
                }
            }
        }
    }
    function generateInterfaces(document) {
        const root = document.definitions.find(def => def.kind === 'OperationDefinition');
        if (!root) {
            return;
        }
        const { name, operation, variableDefinitions, selectionSet } = root;
        const nameStr = name.value;
        if (variableDefinitions.length !== 0) {
            console.log(`export interface ${nameStr}Args {`);
            variableDefinitions.map(({ variable, type }) => {
                console.log('  ' + variable.name.value + ':' + getTypeName(type));
            });
            console.log('}');
        }
        console.log(`export interface ${nameStr}Result {`);
        walkSelectionSet(operation === 'query'
            ? queryType
            : operation === 'subscription'
                ? subscriptionType
                : mutationType, selectionSet);
        console.log('}');
    }
    let anyFailed = false;
    Object.keys(queries).forEach(name => {
        const validated = validate(schema, queries[name], specifiedRules);
        if (validated.length !== 0) {
            console.error(name + ' failed');
            console.error(validated);
            anyFailed = true;
        }
    });
    if (anyFailed) {
        return;
    }
    console.log('/* tslint:disable */');
    console.log('type GQLNullable<A> = A | null | undefined');
    Object.values(schema.getTypeMap()).forEach((node) => {
        if (!node.astNode || node.astNode.kind !== 'EnumTypeDefinition') {
            return;
        }
        console.log('export enum ' + node.name + ' {');
        node.getValues().forEach(enumValue => {
            console.log('  ' + enumValue.name + ' = "' + enumValue.name + '" ,');
        });
        console.log('}');
    });
    Object.values(schema.getTypeMap()).forEach((node) => {
        if (!node.astNode || node.astNode.kind !== 'InputObjectTypeDefinition') {
            return;
        }
        console.log('export interface ' + node.name + ' {');
        Object.values(node.getFields()).forEach((field) => {
            if (field.astNode.type.kind === 'NonNullType') {
                console.log('  ' + field.name + ': ' + getTypeName(field.astNode.type));
            }
            else {
                console.log('  ' + field.name + '?: ' + getTypeName(field.astNode.type));
            }
        });
        console.log('}');
    });
    if (process.env.GENERATE_TYPES) {
        Object.keys(queries).forEach(name => {
            const ast = queries[name];
            collectFragments(ast);
        });
        Object.keys(queries).forEach(name => {
            const ast = queries[name];
            generateInterfaces(ast);
        });
    }
}
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc1NjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnQvcHJvY2Vzc1NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBQzdFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxJQUFJLENBQUE7QUFDN0IsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRS9DLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLCtCQUErQixDQUFBO0FBQ2xFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDZCQUE2QixDQUFBO0FBQzlELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFBO0FBQ3RGLE9BQU8sRUFDTCxtQkFBbUIsRUFDbkIsK0JBQStCLEVBQ2hDLE1BQU0sb0NBQW9DLENBQUE7QUFDM0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0NBQW9DLENBQUE7QUFDeEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0NBQXNDLENBQUE7QUFDMUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sd0NBQXdDLENBQUE7QUFDOUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1DQUFtQyxDQUFBO0FBQ2xFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFBO0FBQzFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFBO0FBQ3BFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQTtBQUM5RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNkJBQTZCLENBQUE7QUFDeEQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0saUNBQWlDLENBQUE7QUFDdkUsT0FBTyxFQUFFLDBCQUEwQixF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