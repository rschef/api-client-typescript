import { PerfClient } from '@neon-exchange/nash-perf';
import Promievent from 'promievent';
import { Contract } from 'web3-eth-contract';
import BigNumber from 'bignumber.js';
import { ListAccountTransactionsParams } from '../queries/account/listAccountTransactions';
import { ListAccountOrderParams } from '../queries/order/listAccountOrders';
import { ListAccountTradeParams } from '../queries/trade/listAccountTrades';
import { GetAccountAddressResult } from '../queries/account/getAccountAddress';
import { ListMovementsParams } from '../queries/movement/listMovements';
import { ListCandlesParams } from '../queries/candlestick/listCandles';
import { ListTradeParams } from '../queries/market/listTrades';
import { GetAccountPortfolioParams } from '../queries/account/getAccountPortfolio';
import { AssetsNoncesData } from '../queries/nonces';
import { GetStatesData, SyncStatesData, SignStatesData } from '../mutations/stateSyncing';
import { SendBlockchainRawTransactionArgs } from '../mutations/blockchain/sendBlockchainRawTransaction';
import { mapMarketsForNashProtocol } from '../helpers';
import { OrderBook, TradeHistory, Ticker, CandleRange, Movement, AccountPortfolio, CancelledOrder, AccountBalance, AccountTransaction, OrderPlaced, Market, AccountVolume, Order, DateTime, AccountOrder, OrderBuyOrSell, OrderCancellationPolicy, MovementType, CurrencyAmount, CurrencyPrice, LegacyLoginParams, SignMovementResult, Blockchain as TSAPIBlockchain, AssetData, Asset } from '../types';
import { NashSocketEvents, PayloadSignature } from '../types/client';
import { CryptoCurrency } from '../constants/currency';
import { APIKey, Blockchain } from '@neon-exchange/nash-protocol';
export * from './environments';
import { EnvironmentConfig, ClientOptions } from './environments';
/** @internal */
export declare const MISSING_NONCES = "missing_asset_nonces";
/** @internal */
export declare const MAX_ORDERS_REACHED = "Maximal number of orders have been reached";
/** @internal */
export declare const MAX_SIGN_STATE_RECURSION = 5;
/** @internal */
export declare const BIG_NUMBER_FORMAT: {
    decimalSeparator: string;
    groupSeparator: string;
    groupSize: number;
    prefix: string;
};
export declare const UNLIMITED_APPROVAL = "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe";
export declare class Client {
    private _socket;
    private mode;
    private maxEthCostPrTransaction;
    private opts;
    private clientOpts;
    private apiUri;
    private _headers;
    private get headers();
    private _subscriptionHandlers;
    private _absintheSocket;
    private initParams;
    private nashCoreConfig;
    private casCookie;
    private publicKey;
    private account?;
    private wsToken;
    private wsUri;
    private isMainNet;
    private gql;
    private web3;
    private authorization;
    private walletIndices;
    private tradedAssets;
    private assetNonces;
    private currentOrderNonce;
    private signStateInProgress;
    private pallierPkStr;
    /** @internal */
    perfClient: PerfClient;
    /** @internal */
    apiKey: APIKey;
    /** @internal */
    ethVaultContract: Contract;
    /** @internal */
    marketData: {
        [key: string]: Market;
    };
    /** @internal */
    nashProtocolMarketData: ReturnType<typeof mapMarketsForNashProtocol>;
    /** @internal */
    assetData: {
        [key: string]: AssetData;
    };
    /**
     * Create a new instance of [[Client]]
     *
     * @param opts
     * @returns
     *
     * Example
     * ```
     * import { Client, EnvironmentConfiguration } from '@neon-exchange/api-client-typescript'
     *
     * const nash = new Client(EnvironmentConfiguration.sandbox)
     * ```
     */
    constructor(opts: EnvironmentConfig, clientOpts?: ClientOptions);
    get affiliateDeveloperCode(): string;
    prefillRPoolIfNeeded(blockchain: Blockchain): Promise<void>;
    prefillRPoolIfNeededForAssets(asset1: CryptoCurrency, asset2?: CryptoCurrency): Promise<void>;
    disconnect(): void;
    private requireMode;
    private requireMPC;
    private requireFull;
    private _createSocket;
    private getAbsintheSocket;
    getSocket(): any;
    private wsAuthCheck;
    /**
     * Returns the connect socket
     *
     * @returns
     *
     * Example
     * ```
     * import { Client, EnvironmentConfiguration } from '@neon-exchange/api-client-typescript'
     *
     * const nash = new Client(EnvironmentConfiguration.sandbox)
     * await nash.login(...)
     *
     * // Getting the orderbook for the neo_eth marked
     * nash.subscriptions.onUpdatedOrderbook(
     *  { marketName: 'neo_eth' },
     *  {
     *    onResult: ({
     *      data: {
     *        updatedOrderBook: { bids, asks }
     *      }
     *    }) => {
     *      console.log(`updated bids ${bids.length}`)
     *      console.log(`updated asks ${asks.length}`)
     *    }
     *  }
     * )
     *
     * // Getting the user orderobok for all markets
     * nash.subscriptions.onUpdatedAccountOrders(
     *  {},
     *  {
     *    onResult: ({
     *      data: {
     *        updatedAccountOrders
     *      }
     *    }) => {
     *      console.log(`Updated orders: {updatedAccountOrders.length}`)
     *    }
     *  }
     * )
     *
     * ```
     */
    get subscriptions(): NashSocketEvents;
    /**
     * Sets up a websocket and authenticates it using the current token.
     *
     * @returns
     *
     * Example
     * ```
     * import { Client, EnvironmentConfiguration } from '@neon-exchange/api-client-typescript'
     *
     * const nash = new Client(EnvironmentConfiguration.sandbox)
     * await nash.login(...)
     *
     * const connection = nash.createSocketConnection()
     *
     * // Getting the orderbook for the neo_eth marked
     * connection.onUpdatedOrderbook(
     *  { marketName: 'neo_eth' },
     *  {
     *    onResult: ({
     *      data: {
     *        updatedOrderBook: { bids, asks }
     *      }
     *    }) => {
     *      console.log(`updated bids ${bids.length}`)
     *      console.log(`updated asks ${asks.length}`)
     *    }
     *  }
     * )
     *
     * // Getting the user orderobok for all markets
     * connection.onUpdatedAccountOrders(
     *  {},
     *  {
     *    onResult: ({
     *      data: {
     *        updatedAccountOrders
     *      }
     *    }) => {
     *      console.log(`Updated orders: {updatedAccountOrders.length}`)
     *    }
     *  }
     * )
     *
     *
     * @deprecated please use subscriptions
     * ```
     */
    createSocketConnection(): NashSocketEvents;
    private _createSocketConnection;
    /**
     * Login using an API key.
     *
     * request.
     * @returns
     * @param secret string
     * @param apiKey string
     * @returns
     *
     * Example
     * ```
     * try {
     *   nash.login(require('PATH_TO_KEY.json'))
     * } catch (e) {
     *   console.error(`login failed ${e}`)
     * }
     * ```
     */
    login({ secret, apiKey }: {
        apiKey: string;
        secret: string;
    }): Promise<void>;
    /**
     * Legacy login against the central account service. Note: you should prefer to use an API key with the `login` method.
     *
     * Be careful about using this feature, private keys are derived using the password.
     * So this technically gives full access to the account. Because of this the following features are not supported using legacy login.
     *
     *  - transferToExternal
     *  - depositToTradingContract
     *  - withdrawFromTradingContract
     *
     * @param email string
     * @param password string
     * @param twoFaCode string
     * @returns
     *
     * Example
     * ```
     * try {
     *   nash.legacyLogin({
     *     email: "email@domain.com",
     *     password: "example"
     *   })
     * } catch (e) {
     *   console.error(`login failed ${e}`)
     * }
     * ```
     */
    legacyLogin({ email, password, twoFaCode, walletIndices, presetWallets, salt }: LegacyLoginParams): Promise<void>;
    private doTwoFactorLogin;
    private createAndUploadKeys;
    /**
     * Get a single [[Ticker]] for the given market name.
     *
     * @param marketName
     * @returns
     *
     * Example
     * ```
     * const ticker = await nash.getTicker('neo_gas')
     * console.log(ticker)
     * ```
     */
    getTicker(marketName: string): Promise<Ticker>;
    /**
     * Get the [[OrderBook]] for the given market.
     *
     * @param marketName
     * @returns
     *
     * Example
     * ```
     * const orderBook = await nash.getOrderBook('neo_gas')
     * console.log(orderBook.bids)
     * ```
     */
    getOrderBook(marketName: string): Promise<OrderBook>;
    /**
     * Get [[TradeHistory]] for the given market name.
     *
     * @param marketName
     * @param limit
     * @param before
     * @returns
     *
     * Example
     * ```
     * const tradeHistory = await nash.listTrades({
     *   marketname : 'neo_gas'
     * })
     * console.log(tradeHistory.trades)
     * ```
     */
    listTrades({ marketName, limit, before }: ListTradeParams): Promise<TradeHistory>;
    /**
     * Fetches as list of all available [[Ticker]] that are active on the exchange.
     *
     * @returns
     *
     * Example
     * ```
     * const tickers = await nash.listTickers()
     * console.log(tickers)
     * ```
     */
    listTickers(): Promise<Ticker[]>;
    /**
     * Fetches as list of all available [[Asset]] that are active on the exchange.
     *
     * @returns
     *
     * Example
     * ```
     * const assets = await nash.listAssets()
     * console.log(assets)
     * ```
     */
    listAssets(): Promise<Asset[]>;
    /**
     * Fetches the current account volumes for the current periods
     *
     * @returns
     *
     * Example
     * ```
     * const volumes = await nash.getAccountVolumes()
     * console.log(volumes.makerFeeRate)
     * console.log(volumes.takerFeeRate)
     * ```
     */
    getAccountVolumes(): Promise<AccountVolume>;
    /**
     * List a [[CandleRange]] for the given market.
     *
     * @param marketName
     * @param before
     * @param interval
     * @param limit
     * @returns
     *
     * Example
     * ```
     * const candleRange = await nash.listCandles({
     *   marketName : 'neo_gas'
     * })
     * console.log(candleRange)
     * ``
     */
    listCandles({ marketName, before, interval, limit }: ListCandlesParams): Promise<CandleRange>;
    /**
     * List all available markets.
     *
     * @returns
     *
     * Example
     * ```
     * const markets = await nash.listMarkets()
     * console.log(markets)
     * ```
     */
    listMarkets(): Promise<Market[]>;
    /**
     * Get a specific [[Market]] by name.
     *
     * @param marketName
     * @returns
     *
     * Example
     * ```
     * const market = await nash.getMarket('neo_gas')
     * console.log(market)
     * ```
     */
    getMarket(marketName: string): Promise<Market>;
    /**
     * list available orders for the current authenticated account.
     * @param before
     * @param buyOrSell
     * @param limit
     * @param marketName
     * @param rangeStart
     * @param rangeStop
     * @param status
     * @param type
     * @returns
     *
     * Example
     * ```
     * const accountOrder = await nash.listAccountOrders({
     *   marketName : 'neo_eth'
     * })
     * console.log(accountOrder.orders)
     * ```
     */
    listAccountOrders({ before, buyOrSell, limit, marketName, rangeStart, rangeStop, status, type, shouldIncludeTrades }?: ListAccountOrderParams): Promise<AccountOrder>;
    /**
     * list available trades for the current authenticated account.
     *
     * @param {ListAccountTradeParams} params
     * @returns
     *
     * Example
     * ```
     * const tradeHistory = await nash.listAccountTrades({
     *   limit : 10,
     *   marketName : 'neo_eth'
     * })
     * console.log(tradeHistory.trades)
     * ```
     */
    listAccountTrades({ before, limit, marketName }?: ListAccountTradeParams): Promise<TradeHistory>;
    /**
     * List available account transactions.
     *
     * @param cursor
     * @param fiatSymbol
     * @param limit
     * @returns
     *
     * Example
     * ```
     * const accountTransaction = await nash.listAccountTransactions({
     *   limit : 150,
     *   ${paramName} : ${paramValue}
     * })
     * console.log(accountTransaction.transactions)
     * ```
     */
    listAccountTransactions({ cursor, fiatSymbol, limit }?: ListAccountTransactionsParams): Promise<AccountTransaction>;
    /**
     * List all balances for current authenticated account.
     *
     * @param ignoreLowBalance
     * @returns
     *
     * Example
     * ```
     * const accountBalance = await nash.listAccountBalances()
     * console.log(accountBalance)
     * ```
     */
    listAccountBalances(ignoreLowBalance: any): Promise<AccountBalance[]>;
    /**
     * Get the deposit address for the given crypto currency.
     *
     * @param currency
     * @returns
     *
     * Example
     * ```
     * import { CryptoCurrency } from '@neon-exchange/api-client-typescript'
     *
     * const address = await nash.getAccountAddress(CryptoCurrency.NEO)
     * console.log(address)
     * ```
     */
    getAccountAddress(currency: CryptoCurrency): Promise<GetAccountAddressResult['getAccountAddress']>;
    /**
     * @param  {CryptoCurrency} currency [description]
     * @return {Promise}                 [description]
     *
     * @deprecated will be removed in next major version use getAccountAddress
     */
    getDepositAddress(currency: CryptoCurrency): Promise<GetAccountAddressResult['getAccountAddress']>;
    /**
     * Get the [[AccountPortfolio]] for the current authenticated account.
     *
     * @param fiatSymbol
     * @param period
     * @returns
     *
     * Example
     * ```
     * const accountPortfolio = await nash.getAccountPortfolio({
     *   fiatSymbol: "USD",
     *
     * })
     * console.log(accountPortfolio)
     * ```
     */
    getAccountPortfolio({ fiatSymbol, period }?: GetAccountPortfolioParams): Promise<AccountPortfolio>;
    /**
     * Get a [[Movement]] by the given id.
     *
     * @param movementID
     * @returns
     *
     * Example
     * ```
     * const movement = await nash.getMovement(1)
     * console.log(movement)
     * ```
     */
    getMovement(movementID: string): Promise<Movement>;
    /**
     * Get [[AccountBalance]] for the given crypto currency.
     *
     * @param currency
     * @returns
     *
     * Example
     * ```
     * import { CryptoCurrency } from '@neon-exchange/api-client-typescript'
     *
     * const accountBalance = await nash.getAcountBalance(CryptoCurrency.ETH)
     * console.log(accountBalance)
     * ```
     */
    getAccountBalance(currency: CryptoCurrency): Promise<AccountBalance>;
    /**
     * Get an order by ID.
     *
     * @param orderId
     * @returns
     *
     * Example
     * ```
     * const order = await nash.getAccountOrder('999')
     * console.log(order)
     * ```
     */
    getAccountOrder(orderId: string): Promise<Order>;
    /**
     * List all movements for the current authenticated account.
     *
     * @param currency
     * @param status
     * @param type
     * @returns
     *
     * Example
     * ```
     * const movements = await nash.listMovements({
     *   currency : 'eth'
     * })
     * console.log(movements)
     * ```
     */
    listMovements({ currency, status, type }: ListMovementsParams): Promise<Movement[]>;
    /**
     * List all current asset nonces
     *
     * @returns
     *
     * Example
     * ```
     * const getNoncesData = await nash.getAssetNonces()
     * console.log(getNoncesData)
     * ```
     */
    getAssetNonces(assetList: string[]): Promise<AssetsNoncesData[]>;
    /**
     * Gets Balance States, Signs Balance States, then Syncs Balance states to the server
     *
     * @param sync Whether to sync the state updates to the blockchain. Defaults to false
     *
     * @returns
     *
     * Example
     * ```
     * // sign states
     * const signStates = await nash.getSignAndSyncStates()
     * console.log(signStates)
     *
     * // sign and sync states to blockchain
     * const signAndSyncStates = await nash.getSignAndSyncStates(true)
     * console.log(signAndSyncStates)
     *
     * ```
     */
    getSignAndSyncStates(sync?: boolean): Promise<SyncStatesData | SignStatesData>;
    private state_map_from_states;
    /**
     * Submit all states and open orders to be signed for settlement
     *
     * @returns
     *
     * Example
     * ```
     * const signStatesResult = await nash.signStates(getStatesResult)
     * console.log(signStatesResult)
     * ```
     */
    signStates(getStatesData: GetStatesData, depth?: number): Promise<SignStatesData>;
    /**
     * List all states and open orders to be signed for settlement
     *
     * @returns
     *
     * Example
     * ```
     * const getStatesData = await nash.getStates()
     * console.log(getStatesData)
     * ```
     */
    syncStates(signStatesData: SignStatesData): Promise<SyncStatesData>;
    /**
     * Cancel an order by ID.
     *
     * @param orderID
     * @returns
     *
     * Example
     * ```
     * const cancelledOrder = await nash.cancelOrder('11')
     * console.log(cancelledOrder)
     * ```
     */
    cancelOrder(orderID: string, marketName: string): Promise<CancelledOrder>;
    /**
     * Cancel all orders by market name
     *
     * @param marketName
     * @returns
     *
     * Example
     * ```
     * const result = await nash.cancelAllOrders('neo_gas')
     * console.log(result)
     * ```
     */
    cancelAllOrders(marketName?: string): Promise<boolean>;
    /**
     * Place a limit order.
     *
     * @param allowTaker
     * @param amount
     * @param buyOrSell
     * @param cancelationPolicy
     * @param limitPrice
     * @param marketName
     * @param cancelAt
     * @returns
     *
     * Example
     * ```typescript
     * import {
     *   createCurrencyAmount,
     *   createCurrencyPrice,
     *   OrderBuyOrSell,
     *   OrderCancellationPolicy
     * } from '@neon-exchange/api-client-typescript'
     *
     * const order = await nash.placeLimitOrder(
     *   false,
     *   createCurrencyAmount('1', CryptoCurrency.NEO),
     *   OrderBuyOrSell.BUY,
     *   OrderCancellationPolicy.GOOD_TIL_CANCELLED,
     *   createCurrencyPrice('0.01', CryptoCurrency.GAS, CryptoCurrency.NEO),
     *   'neo_gas'
     * )
     * console.log(order.status)
     * ```
     */
    placeLimitOrder(allowTaker: boolean, amount: CurrencyAmount, buyOrSell: OrderBuyOrSell, cancellationPolicy: OrderCancellationPolicy, limitPrice: CurrencyPrice, marketName: string, cancelAt?: DateTime): Promise<OrderPlaced>;
    /**
     * Place a market order.
     *
     * @param amount
     * @param buyOrSell
     * @param marketName
     * @returns
     *
     * Example
     * ```typescript
     * import {
     *   createCurrencyAmount,
     *   OrderBuyOrSell,
     * } from '@neon-exchange/api-client-typescript'
     *
     * const order = await nash.placeMarketOrder(
     *   createCurrencyAmount('1.00', CryptoCurrency.NEO),
     *   OrderBuyOrSell.SELL,
     *   'neo_gas'
     * )
     * console.log(order.status)
     * ```
     */
    placeMarketOrder(amount: CurrencyAmount, buyOrSell: OrderBuyOrSell, marketName: string): Promise<OrderPlaced>;
    /**
     * Place a stop limit order.
     *
     * @param allowTaker
     * @param amount
     * @param buyOrSell
     * @param cancellationPolicy
     * @param limitPrice
     * @param marketName
     * @param stopPrice
     * @param cancelAt
     * @returns
     *
     * Example
     * ```typescript
     * import {
     *   createCurrencyAmount,
     *   createCurrencyPrice,
     *   OrderBuyOrSell,
     *   OrderCancellationPolicy
     * } from '@neon-exchange/api-client-typescript'
     *
     * const order = await nash.placeStopLimitOrder(
     *   false,
     *   createCurrencyAmount('1', CryptoCurrency.NEO),
     *   OrderBuyOrSell.BUY,
     *   OrderCancellationPolicy.GOOD_TIL_CANCELLED,
     *   createCurrencyPrice('0.01', CryptoCurrency.GAS, CryptoCurrency.NEO),
     *   'neo_gas'
     *   createCurrencyPrice('0.02', CryptoCurrency.GAS, CryptoCurrency.NEO)
     * )
     * console.log(order.status)
     * ```
     */
    placeStopLimitOrder(allowTaker: boolean, amount: CurrencyAmount, buyOrSell: OrderBuyOrSell, cancellationPolicy: OrderCancellationPolicy, limitPrice: CurrencyPrice, marketName: string, stopPrice: CurrencyPrice, cancelAt?: DateTime): Promise<OrderPlaced>;
    /**
     * Place a stop market order.
     *
     * @param amount
     * @param buyOrSell
     * @param marketName
     * @param stopPrice
     * @returns
     *
     * Example
     * ```typescript
     * import {
     *   createCurrencyAmount,
     *   createCurrencyPrice,
     *   OrderBuyOrSell,
     * } from '@neon-exchange/api-client-typescript'
     *
     * const order = await nash.placeStopLimitOrder(
     *   createCurrencyAmount('1', CryptoCurrency.NEO),
     *   OrderBuyOrSell.BUY,
     *   'neo_gas'
     *   createCurrencyPrice('0.02', CryptoCurrency.GAS, CryptoCurrency.NEO)
     * )
     * console.log(order.status)
     * ```
     */
    placeStopMarketOrder(amount: CurrencyAmount, buyOrSell: OrderBuyOrSell, marketName: string, stopPrice: CurrencyPrice): Promise<OrderPlaced>;
    private handleOrderPlaced;
    private handleOrderError;
    /**
     * Used by our internal trading bot
     * @param  {string}                      address
     * @param  {CurrencyAmount}              quantity
     * @param  {MovementType}                type
     * @return {Promise<SignMovementResult>}
     */
    legacyAddMovement(address: string, quantity: CurrencyAmount, type: MovementType): Promise<SignMovementResult>;
    queryAllowance(assetData: AssetData): Promise<BigNumber>;
    private validateTransactionCost;
    private approveERC20Transaction;
    private approveAndAwaitAllowance;
    transferToExternal(params: {
        quantity: CurrencyAmount;
        address: string;
    }): Promise<{
        txId: string;
        gasUsed?: number;
    }>;
    private signNeoPayload;
    private signEthTransaction;
    depositToTradingContract(quantity: CurrencyAmount): Promievent<{
        txId: string;
        movementId: string;
    }>;
    withdrawFromTradingContract(quantity: CurrencyAmount): Promievent<{
        txId: string;
        movementId: string;
    }>;
    private prepareMovement;
    private updateMovement;
    private transferToTradingContract;
    isMovementCompleted(movementId: string): Promise<boolean>;
    private _transferToTradingContract;
    findPendingChainMovements(chain: TSAPIBlockchain): Promise<Movement[]>;
    resumeTradingContractTransaction(unfinishedTransaction: {
        movement: Movement;
        signature: PayloadSignature;
        blockchainSignature: string;
    }): Promievent<{
        txId: string;
    }>;
    private _resumeVaultTransaction;
    private updateDepositWithdrawalMovementWithTx;
    /**
     * Sign a withdraw request.
     *
     * @param address
     * @param quantity
     * @returns
     *
     * Example
     * ```typescript
     * import { createCurrencyAmount } from '@neon-exchange/api-client-ts'
     *
     * const address = 'd5480a0b20e2d056720709a9538b17119fbe9fd6';
     * const amount = createCurrencyAmount('1.5', CryptoCurrency.ETH);
     * const signedMovement = await nash.signWithdrawRequest(address, amount);
     * console.log(signedMovement)
     * ```
     */
    signWithdrawRequest(address: string, quantity: CurrencyAmount, nonce?: number): Promise<SignMovementResult>;
    /**
     * helper function that returns the correct types for the needed GQL queries
     * and mutations.
     *
     * @param [SigningPayloadID]
     * @param payload
     * @returns
     */
    private signPayload;
    private signPayloadMpc;
    private signPayloadFull;
    private fillPoolFn;
    private updateTradedAssetNonces;
    private getNoncesForTrade;
    private fetchMarketData;
    private completeBtcTransactionSignatures;
    sendBlockchainRawTransaction(params: {
        blockchain: SendBlockchainRawTransactionArgs['payload']['blockchain'];
        payload: SendBlockchainRawTransactionArgs['payload']['transactionPayload'];
    }): Promise<string>;
    private completePayloadSignature;
    private fetchAssetData;
    getNeoAddress(): string;
    getEthAddress(): string;
    getBtcAddress(): string;
}
