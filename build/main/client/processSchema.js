"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const fs_1 = require("fs");
const utilities_1 = require("graphql/utilities");
const listMarkets_1 = require("../queries/market/listMarkets");
const getMarket_1 = require("../queries/market/getMarket");
const listAccountTransactions_1 = require("../queries/account/listAccountTransactions");
const listAccountOrders_1 = require("../queries/order/listAccountOrders");
const listAccountTrades_1 = require("../queries/trade/listAccountTrades");
const getAccountAddress_1 = require("../queries/account/getAccountAddress");
const listAccountBalances_1 = require("../queries/account/listAccountBalances");
const listMovements_1 = require("../queries/movement/listMovements");
const getAccountBalance_1 = require("../queries/account/getAccountBalance");
const getAccountOrder_1 = require("../queries/order/getAccountOrder");
const getMovement_1 = require("../queries/movement/getMovement");
const getTicker_1 = require("../queries/market/getTicker");
const cancelOrder_1 = require("../mutations/orders/cancelOrder");
const cancelAllOrders_1 = require("../mutations/orders/cancelAllOrders");
const twoFactorLoginMutation_1 = require("../mutations/account/twoFactorLoginMutation");
const signIn_1 = require("../mutations/account/signIn");
const addKeysWithWallets_1 = require("../mutations/account/addKeysWithWallets");
const listCandles_1 = require("../queries/candlestick/listCandles");
const listTickers_1 = require("../queries/market/listTickers");
const listTrades_1 = require("../queries/market/listTrades");
const getOrderBook_1 = require("../queries/market/getOrderBook");
const placeLimitOrder_1 = require("../mutations/orders/placeLimitOrder");
const placeMarketOrder_1 = require("../mutations/orders/placeMarketOrder");
const placeStopLimitOrder_1 = require("../mutations/orders/placeStopLimitOrder");
const placeStopMarketOrder_1 = require("../mutations/orders/placeStopMarketOrder");
const addMovementMutation_1 = require("../mutations/movements/addMovementMutation");
const prepareMovement_1 = require("../mutations/movements/prepareMovement");
const updateMovement_1 = require("../mutations/movements/updateMovement");
const getAccountPortfolio_1 = require("../queries/account/getAccountPortfolio");
const listAsset_1 = require("../queries/asset/listAsset");
const newAccountTrades_1 = require("../subscriptions/newAccountTrades");
const updatedAccountOrders_1 = require("../subscriptions/updatedAccountOrders");
const updatedOrderBook_1 = require("../subscriptions/updatedOrderBook");
const newTrades_1 = require("../subscriptions/newTrades");
const updatedTickers_1 = require("../subscriptions/updatedTickers");
const updatedCandles_1 = require("../subscriptions/updatedCandles");
const dhFillPool_1 = require("../mutations/dhFillPool");
const getAssetsNonces_1 = require("../queries/nonces/getAssetsNonces");
const syncStatesMutation_1 = require("../mutations/stateSyncing/syncStatesMutation");
const signStatesMutation_1 = require("../mutations/stateSyncing/signStatesMutation");
const completeSignature_1 = require("../mutations/mpc/completeSignature");
const completeBTCTransacitonSignatures_1 = require("../mutations/mpc/completeBTCTransacitonSignatures");
const sendBlockchainRawTransaction_1 = require("../mutations/blockchain/sendBlockchainRawTransaction");
const queries = {
    LIST_ACCOUNT_TRADES: listAccountTrades_1.LIST_ACCOUNT_TRADES,
    GET_ACCOUNT_ADDRESS: getAccountAddress_1.GET_ACCOUNT_ADDRESS,
    LIST_ACCOUNT_BALANCES: listAccountBalances_1.LIST_ACCOUNT_BALANCES,
    LIST_MOVEMENTS: listMovements_1.LIST_MOVEMENTS,
    GET_ACCOUNT_BALANCE: getAccountBalance_1.GET_ACCOUNT_BALANCE,
    GET_ACCOUNT_ORDER: getAccountOrder_1.GET_ACCOUNT_ORDER,
    GET_MOVEMENT: getMovement_1.GET_MOVEMENT,
    GET_TICKER: getTicker_1.GET_TICKER,
    CANCEL_ORDER_MUTATION: cancelOrder_1.CANCEL_ORDER_MUTATION,
    CANCEL_ALL_ORDERS_MUTATION: cancelAllOrders_1.CANCEL_ALL_ORDERS_MUTATION,
    USER_2FA_LOGIN_MUTATION: twoFactorLoginMutation_1.USER_2FA_LOGIN_MUTATION,
    SIGN_IN_MUTATION: signIn_1.SIGN_IN_MUTATION,
    ADD_KEYS_WITH_WALLETS_MUTATION: addKeysWithWallets_1.ADD_KEYS_WITH_WALLETS_MUTATION,
    LIST_CANDLES: listCandles_1.LIST_CANDLES,
    LIST_TICKERS: listTickers_1.LIST_TICKERS,
    LIST_TRADES: listTrades_1.LIST_TRADES,
    GET_ORDERBOOK: getOrderBook_1.GET_ORDERBOOK,
    PLACE_LIMIT_ORDER_MUTATION: placeLimitOrder_1.PLACE_LIMIT_ORDER_MUTATION,
    PLACE_MARKET_ORDER_MUTATION: placeMarketOrder_1.PLACE_MARKET_ORDER_MUTATION,
    PLACE_STOP_LIMIT_ORDER_MUTATION: placeStopLimitOrder_1.PLACE_STOP_LIMIT_ORDER_MUTATION,
    PLACE_STOP_MARKET_ORDER_MUTATION: placeStopMarketOrder_1.PLACE_STOP_MARKET_ORDER_MUTATION,
    ADD_MOVEMENT_MUTATION: addMovementMutation_1.ADD_MOVEMENT_MUTATION,
    PREPARE_MOVEMENT_MUTATION: prepareMovement_1.PREPARE_MOVEMENT_MUTATION,
    UPDATE_MOVEMENT_MUTATION: updateMovement_1.UPDATE_MOVEMENT_MUTATION,
    GET_ACCOUNT_PORTFOLIO: getAccountPortfolio_1.GET_ACCOUNT_PORTFOLIO,
    LIST_ASSETS_QUERY: listAsset_1.LIST_ASSETS_QUERY,
    NEW_ACCOUNT_TRADES: newAccountTrades_1.NEW_ACCOUNT_TRADES,
    UPDATED_ACCOUNT_ORDERS: updatedAccountOrders_1.UPDATED_ACCOUNT_ORDERS,
    UPDATED_ORDER_BOOK: updatedOrderBook_1.UPDATED_ORDER_BOOK,
    NEW_TRADES: newTrades_1.NEW_TRADES,
    UPDATED_TICKERS: updatedTickers_1.UPDATED_TICKERS,
    UPDATED_CANDLES: updatedCandles_1.UPDATED_CANDLES,
    DH_FIIL_POOL: dhFillPool_1.DH_FIIL_POOL,
    GET_ASSETS_NONCES_QUERY: getAssetsNonces_1.GET_ASSETS_NONCES_QUERY,
    SYNC_STATES_MUTATION: syncStatesMutation_1.SYNC_STATES_MUTATION,
    SIGN_STATES_MUTATION: signStatesMutation_1.SIGN_STATES_MUTATION,
    COMPLETE_PAYLOAD_SIGNATURE: completeSignature_1.COMPLETE_PAYLOAD_SIGNATURE,
    COMPLETE_BTC_TRANSACTION_SIGNATURES: completeBTCTransacitonSignatures_1.COMPLETE_BTC_TRANSACTION_SIGNATURES,
    SEND_BLOCKCHAIN_RAW_TRANSACTION: sendBlockchainRawTransaction_1.SEND_BLOCKCHAIN_RAW_TRANSACTION,
    LIST_MARKETS_QUERY: listMarkets_1.LIST_MARKETS_QUERY,
    GET_MARKET_QUERY: getMarket_1.GET_MARKET_QUERY,
    LIST_ACCOUNT_TRANSACTIONS: listAccountTransactions_1.LIST_ACCOUNT_TRANSACTIONS,
    LIST_ACCOUNT_ORDERS: listAccountOrders_1.LIST_ACCOUNT_ORDERS,
    LIST_ACCOUNT_ORDERS_WITH_TRADES: listAccountOrders_1.LIST_ACCOUNT_ORDERS_WITH_TRADES
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
    const src = await new Promise((resolve, reject) => fs_1.readFile('./schema.graphql', 'utf-8', (err, buff) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(buff);
        }
    }));
    const schema = utilities_1.buildSchema(src);
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
                    if (graphql_1.isNonNullType(fieldType) ||
                        prefix[prefix.length - 1] === 'Array<') {
                        fieldType = fieldType.ofType;
                    }
                    else {
                        prefix.push('GQLNullable<');
                    }
                    if (graphql_1.isListType(fieldType)) {
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
        const validated = graphql_1.validate(schema, queries[name], graphql_1.specifiedRules);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc1NjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnQvcHJvY2Vzc1NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUE2RTtBQUM3RSwyQkFBNkI7QUFDN0IsaURBQStDO0FBRS9DLCtEQUFrRTtBQUNsRSwyREFBOEQ7QUFDOUQsd0ZBQXNGO0FBQ3RGLDBFQUcyQztBQUMzQywwRUFBd0U7QUFDeEUsNEVBQTBFO0FBQzFFLGdGQUE4RTtBQUM5RSxxRUFBa0U7QUFDbEUsNEVBQTBFO0FBQzFFLHNFQUFvRTtBQUNwRSxpRUFBOEQ7QUFDOUQsMkRBQXdEO0FBQ3hELGlFQUF1RTtBQUN2RSx5RUFBZ0Y7QUFDaEYsd0ZBQXFGO0FBQ3JGLHdEQUE4RDtBQUM5RCxnRkFBd0Y7QUFDeEYsb0VBQWlFO0FBQ2pFLCtEQUE0RDtBQUM1RCw2REFBMEQ7QUFDMUQsaUVBQThEO0FBQzlELHlFQUFnRjtBQUNoRiwyRUFBa0Y7QUFDbEYsaUZBQXlGO0FBQ3pGLG1GQUEyRjtBQUMzRixvRkFBa0Y7QUFDbEYsNEVBQWtGO0FBQ2xGLDBFQUFnRjtBQUNoRixnRkFBOEU7QUFDOUUsMERBQThEO0FBQzlELHdFQUFzRTtBQUN0RSxnRkFBOEU7QUFDOUUsd0VBQXNFO0FBQ3RFLDBEQUF1RDtBQUN2RCxvRUFBaUU7QUFDakUsb0VBQWlFO0FBQ2pFLHdEQUFzRDtBQUN0RCx1RUFBMkU7QUFDM0UscUZBQW1GO0FBQ25GLHFGQUFtRjtBQUNuRiwwRUFBK0U7QUFDL0Usd0dBQXVHO0FBQ3ZHLHVHQUFzRztBQUV0RyxNQUFNLE9BQU8sR0FBRztJQUNkLG1CQUFtQixFQUFuQix1Q0FBbUI7SUFDbkIsbUJBQW1CLEVBQW5CLHVDQUFtQjtJQUNuQixxQkFBcUIsRUFBckIsMkNBQXFCO0lBQ3JCLGNBQWMsRUFBZCw4QkFBYztJQUNkLG1CQUFtQixFQUFuQix1Q0FBbUI7SUFDbkIsaUJBQWlCLEVBQWpCLG1DQUFpQjtJQUNqQixZQUFZLEVBQVosMEJBQVk7SUFDWixVQUFVLEVBQVYsc0JBQVU7SUFDVixxQkFBcUIsRUFBckIsbUNBQXFCO0lBQ3JCLDBCQUEwQixFQUExQiw0Q0FBMEI7SUFDMUIsdUJBQXVCLEVBQXZCLGdEQUF1QjtJQUN2QixnQkFBZ0IsRUFBaEIseUJBQWdCO0lBQ2hCLDhCQUE4QixFQUE5QixtREFBOEI7SUFDOUIsWUFBWSxFQUFaLDBCQUFZO0lBQ1osWUFBWSxFQUFaLDBCQUFZO0lBQ1osV0FBVyxFQUFYLHdCQUFXO0lBQ1gsYUFBYSxFQUFiLDRCQUFhO0lBQ2IsMEJBQTBCLEVBQTFCLDRDQUEwQjtJQUMxQiwyQkFBMkIsRUFBM0IsOENBQTJCO0lBQzNCLCtCQUErQixFQUEvQixxREFBK0I7SUFDL0IsZ0NBQWdDLEVBQWhDLHVEQUFnQztJQUNoQyxxQkFBcUIsRUFBckIsMkNBQXFCO0lBQ3JCLHlCQUF5QixFQUF6QiwyQ0FBeUI7SUFDekIsd0JBQXdCLEVBQXhCLHlDQUF3QjtJQUN4QixxQkFBcUIsRUFBckIsMkNBQXFCO0lBQ3JCLGlCQUFpQixFQUFqQiw2QkFBaUI7SUFDakIsa0JBQWtCLEVBQWxCLHFDQUFrQjtJQUNsQixzQkFBc0IsRUFBdEIsNkNBQXNCO0lBQ3RCLGtCQUFrQixFQUFsQixxQ0FBa0I7SUFDbEIsVUFBVSxFQUFWLHNCQUFVO0lBQ1YsZUFBZSxFQUFmLGdDQUFlO0lBQ2YsZUFBZSxFQUFmLGdDQUFlO0lBQ2YsWUFBWSxFQUFaLHlCQUFZO0lBQ1osdUJBQXVCLEVBQXZCLHlDQUF1QjtJQUN2QixvQkFBb0IsRUFBcEIseUNBQW9CO0lBQ3BCLG9CQUFvQixFQUFwQix5Q0FBb0I7SUFDcEIsMEJBQTBCLEVBQTFCLDhDQUEwQjtJQUMxQixtQ0FBbUMsRUFBbkMsc0VBQW1DO0lBQ25DLCtCQUErQixFQUEvQiw4REFBK0I7SUFDL0Isa0JBQWtCLEVBQWxCLGdDQUFrQjtJQUNsQixnQkFBZ0IsRUFBaEIsNEJBQWdCO0lBQ2hCLHlCQUF5QixFQUF6QixtREFBeUI7SUFDekIsbUJBQW1CLEVBQW5CLHVDQUFtQjtJQUNuQiwrQkFBK0IsRUFBL0IsbURBQStCO0NBQ2hDLENBQUE7QUFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFBO0FBRTdDLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLEVBQUU7SUFDN0IsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDNUIsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLG9CQUFvQixFQUFFO1lBQ3JDLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7U0FDeEM7SUFDSCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQUNELEtBQUssVUFBVSxHQUFHO0lBQ2hCLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FDeEQsYUFBUSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUNsRCxJQUFJLEdBQUcsRUFBRTtZQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUNaO2FBQU07WUFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDZDtJQUNILENBQUMsQ0FBQyxDQUNILENBQUE7SUFFRCxNQUFNLE1BQU0sR0FBRyx1QkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQy9CLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQTtJQUN2QyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUE7SUFDN0MsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtJQUNyRCxNQUFNLFNBQVMsR0FBRztRQUNoQixFQUFFLEVBQUUsUUFBUTtRQUNaLEtBQUssRUFBRSxRQUFRO1FBQ2YsR0FBRyxFQUFFLFFBQVE7UUFDYixLQUFLLEVBQUUsUUFBUTtRQUNmLFVBQVUsRUFBRSxRQUFRO1FBQ3BCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLGNBQWMsRUFBRSxRQUFRO1FBQ3hCLGdCQUFnQixFQUFFLFFBQVE7UUFDMUIsY0FBYyxFQUFFLFFBQVE7UUFDeEIsUUFBUSxFQUFFLFFBQVE7UUFDbEIsT0FBTyxFQUFFLFNBQVM7UUFDbEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxNQUFNLEVBQUUsUUFBUTtRQUNoQixJQUFJLEVBQUUsUUFBUTtRQUNkLGFBQWEsRUFBRSxRQUFRO0tBQ3hCLENBQUE7SUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRTtRQUN6QixJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuQixPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUN2QjtRQUNELE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDOUIsSUFBSSxDQUFDLEVBQUU7WUFDTCxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssb0JBQW9CLEVBQUU7Z0JBQ3hELE9BQU8sSUFBSSxDQUFBO2FBQ1o7WUFDRCxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssc0JBQXNCLEVBQUU7Z0JBQzFELE9BQU8sSUFBSSxDQUFBO2FBQ1o7WUFDRCxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssMkJBQTJCLEVBQUU7Z0JBQy9ELE9BQU8sSUFBSSxDQUFBO2FBQ1o7WUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQTtTQUN4QztRQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxDQUFBO0lBQ3pDLENBQUMsQ0FBQTtJQUVELE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sR0FBRyxLQUFLLEVBQUUsRUFBRTtRQUM1QyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFO1lBQzVCLElBQUksT0FBTyxFQUFFO2dCQUNYLE9BQU8sUUFBUSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFBO2FBQy9DO1lBQ0QsT0FBTyxvQkFBb0IsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQTtTQUM1RDtRQUNELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUU7WUFDL0IsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUNwQztRQUNELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDN0IsSUFBSSxPQUFPLEVBQUU7Z0JBQ1gsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ2pEO1lBQ0QsT0FBTyxjQUFjLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUE7U0FDeEU7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3pCLENBQUMsQ0FBQTtJQUVELGdCQUFnQjtJQUNoQiwyREFBMkQ7SUFDM0QseURBQXlEO0lBQ3pELHNDQUFzQztJQUN0QywrQkFBK0I7SUFDL0IsRUFBRTtJQUNGLGdFQUFnRTtJQUNoRSxzREFBc0Q7SUFDdEQsU0FBUyxnQkFBZ0IsQ0FDdkIsVUFBVSxFQUNWLElBQUksRUFDSixNQUFNLEdBQUcsSUFBSSxFQUNiLGFBQWEsR0FBRyxJQUFJO1FBRXBCLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNqQixLQUFLLGdCQUFnQjtnQkFDbkIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUE7Z0JBQ3BDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO29CQUNyQyxNQUFNLElBQUksS0FBSyxDQUNiLDBCQUEwQjt3QkFDeEIsWUFBWTt3QkFDWix5QkFBeUIsQ0FDNUIsQ0FBQTtpQkFDRjtnQkFDRCxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBO2dCQUNwRCxNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUE7Z0JBQ3pELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7Z0JBQ3pDLGdCQUFnQixDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQTtnQkFDL0QsTUFBSztZQUNQLEtBQUssY0FBYztnQkFDakIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQzFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxnQkFBZ0IsQ0FDckMsQ0FBQTtnQkFDRCxNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUE7Z0JBQzFCLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3hCLGVBQWUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7d0JBQ3pDLGVBQWUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7b0JBQ25ELGVBQWUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ3JELENBQUMsQ0FBQyxDQUFBO2dCQUNGLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUN2QyxHQUFHLENBQUMsRUFBRSxDQUNKLEdBQUcsQ0FBQyxJQUFJLEtBQUssZ0JBQWdCO29CQUM3QixDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssT0FBTzt3QkFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssWUFBWTt3QkFDL0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUNyQixDQUFBO2dCQUVELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7Z0JBQzlDLElBQ0UsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDO29CQUN2QixTQUFTLENBQUMsTUFBTSxLQUFLLENBQUM7b0JBQ3RCLGFBQWEsRUFDYjtvQkFDQSw4Q0FBOEM7aUJBQy9DO2dCQUNELElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7b0JBQ3JELHVCQUF1QjtvQkFDdkIsZ0RBQWdEO29CQUNoRCxJQUFJO29CQUNKLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFBO29CQUNyRSxPQUFNO2lCQUNQO2dCQUVELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ2hDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7b0JBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQTtxQkFDOUI7b0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFBO29CQUN4RCxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQ3JCLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsTUFBTSxHQUFHLElBQUksRUFBRSxLQUFLLENBQUMsQ0FDdEQsQ0FBQTtvQkFDRCxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUMzQyxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsUUFBUSxDQUFBO3dCQUNqQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLE1BQU0sR0FBRyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7b0JBQzFELENBQUMsQ0FBQyxDQUFBO2dCQUNKLENBQUMsQ0FBQyxDQUFBO2dCQUVGLE1BQUs7WUFDUCxLQUFLLE9BQU8sQ0FBQyxDQUFDO2dCQUNaLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxHQUFHLElBQUksQ0FBQTtnQkFDMUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtnQkFDNUIsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2dCQUMvQyxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFBO2dCQUMxQixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtnQkFFakQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO2dCQUNqQixPQUFPLElBQUksRUFBRTtvQkFDWCxJQUNFLHVCQUFhLENBQUMsU0FBUyxDQUFDO3dCQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQ3RDO3dCQUNBLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFBO3FCQUM3Qjt5QkFBTTt3QkFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO3FCQUM1QjtvQkFDRCxJQUFJLG9CQUFVLENBQUMsU0FBUyxDQUFDLEVBQUU7d0JBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7d0JBQ3JCLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFBO3FCQUM3QjtvQkFDRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFO3dCQUM1QixNQUFLO3FCQUNOO2lCQUNGO2dCQUNELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBQ2pDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUU1Qyw4REFBOEQ7Z0JBQzlELElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQ1QsTUFBTTt3QkFDSixTQUFTO3dCQUNULElBQUk7d0JBQ0osU0FBUzt3QkFDVCxXQUFXLENBQUMsU0FBUyxDQUFDO3dCQUN0QixVQUFVLENBQ2IsQ0FBQTtpQkFDRjtxQkFBTTtvQkFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxTQUFTLEdBQUcsSUFBSSxHQUFHLFNBQVMsR0FBRyxHQUFHLENBQUMsQ0FBQTtvQkFDeEQsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUE7b0JBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxVQUFVLENBQUMsQ0FBQTtpQkFDdkM7YUFDRjtTQUNGO0lBQ0gsQ0FBQztJQUVELFNBQVMsa0JBQWtCLENBQUMsUUFBUTtRQUNsQyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FDcEMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLHFCQUFxQixDQUMxQyxDQUFBO1FBQ0QsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULE9BQU07U0FDUDtRQUVELE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixFQUFFLFlBQVksRUFBRSxHQUFHLElBQUksQ0FBQTtRQUNuRSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQzFCLElBQUksbUJBQW1CLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixPQUFPLFFBQVEsQ0FBQyxDQUFBO1lBQ2hELG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtZQUNuRSxDQUFDLENBQUMsQ0FBQTtZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDakI7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixPQUFPLFVBQVUsQ0FBQyxDQUFBO1FBQ2xELGdCQUFnQixDQUNkLFNBQVMsS0FBSyxPQUFPO1lBQ25CLENBQUMsQ0FBQyxTQUFTO1lBQ1gsQ0FBQyxDQUFDLFNBQVMsS0FBSyxjQUFjO2dCQUM5QixDQUFDLENBQUMsZ0JBQWdCO2dCQUNsQixDQUFDLENBQUMsWUFBWSxFQUNoQixZQUFZLENBQ2IsQ0FBQTtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDbEIsQ0FBQztJQUVELElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQTtJQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNsQyxNQUFNLFNBQVMsR0FBRyxrQkFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsd0JBQWMsQ0FBQyxDQUFBO1FBQ2pFLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUE7WUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUN4QixTQUFTLEdBQUcsSUFBSSxDQUFBO1NBQ2pCO0lBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFJLFNBQVMsRUFBRTtRQUNiLE9BQU07S0FDUDtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtJQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRDQUE0QyxDQUFDLENBQUE7SUFDekQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRTtRQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxvQkFBb0IsRUFBRTtZQUMvRCxPQUFNO1NBQ1A7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFBO1FBQzlDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksR0FBRyxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQTtRQUN0RSxDQUFDLENBQUMsQ0FBQTtRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDbEIsQ0FBQyxDQUFDLENBQUE7SUFDRixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFO1FBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLDJCQUEyQixFQUFFO1lBQ3RFLE9BQU07U0FDUDtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQTtRQUNuRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFO1lBQ3JELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBRTtnQkFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTthQUN4RTtpQkFBTTtnQkFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO2FBQ3pFO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2xCLENBQUMsQ0FBQyxDQUFBO0lBQ0YsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtRQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNsQyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDekIsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdkIsQ0FBQyxDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNsQyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDekIsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDekIsQ0FBQyxDQUFDLENBQUE7S0FDSDtBQUNILENBQUM7QUFDRCxHQUFHLEVBQUUsQ0FBQSJ9