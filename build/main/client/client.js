"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbsintheSocket = __importStar(require("@absinthe/socket"));
const nash_perf_1 = require("@neon-exchange/nash-perf");
const set_cookie_parser_1 = __importDefault(require("set-cookie-parser"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const array_buffer_to_hex_1 = __importDefault(require("array-buffer-to-hex"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const NeonJS = __importStar(require("@cityofzion/neon-js"));
const promievent_1 = __importDefault(require("promievent"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
const coinselect_1 = __importDefault(require("coinselect"));
const neon_core_1 = require("@cityofzion/neon-core");
const ethereumjs_tx_1 = require("ethereumjs-tx");
const web3_1 = __importDefault(require("web3"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ApolloError_1 = require("./ApolloError");
const listMarkets_1 = require("../queries/market/listMarkets");
const getMarket_1 = require("../queries/market/getMarket");
const listAccountTransactions_1 = require("../queries/account/listAccountTransactions");
const listAccountOrders_1 = require("../queries/order/listAccountOrders");
const listAccountTrades_1 = require("../queries/trade/listAccountTrades");
const getAccountAddress_1 = require("../queries/account/getAccountAddress");
const listAccountBalances_1 = require("../queries/account/listAccountBalances");
const getAccountVolumes_1 = require("../queries/account/getAccountVolumes");
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
// import { UPDATED_ORDER_BOOK } from '../subscriptions/updatedOrderBook'
const newTrades_1 = require("../subscriptions/newTrades");
const updatedTickers_1 = require("../subscriptions/updatedTickers");
const updatedCandles_1 = require("../subscriptions/updatedCandles");
const dhFillPool_1 = require("../mutations/dhFillPool");
const nonces_1 = require("../queries/nonces");
const utils_1 = require("./utils");
const stateSyncing_1 = require("../mutations/stateSyncing");
const completeSignature_1 = require("../mutations/mpc/completeSignature");
const completeBTCTransacitonSignatures_1 = require("../mutations/mpc/completeBTCTransacitonSignatures");
const sendBlockchainRawTransaction_1 = require("../mutations/blockchain/sendBlockchainRawTransaction");
const helpers_1 = require("../helpers");
const types_1 = require("../types");
const client_1 = require("../types/client");
const movements_1 = require("./movements");
const queryPrinter_1 = require("./queryPrinter");
const currency_1 = require("../constants/currency");
const nash_protocol_1 = require("@neon-exchange/nash-protocol");
const ethUtils_1 = require("./ethUtils");
const settlementABI_1 = require("./abi/eth/settlementABI");
const erc20ABI_1 = require("./abi/eth/erc20ABI");
const btcUtils_1 = require("./btcUtils");
__export(require("./environments"));
const environments_1 = require("./environments");
const phoenix_1 = require("../client/phoenix");
const WebSocket = require('websocket').w3cwebsocket;
/** @internal */
const BLOCKCHAIN_TO_BIP44 = {
    [nash_protocol_1.Blockchain.ETH]: nash_protocol_1.BIP44.ETH,
    [nash_protocol_1.Blockchain.BTC]: nash_protocol_1.BIP44.BTC,
    [nash_protocol_1.Blockchain.NEO]: nash_protocol_1.BIP44.NEO
};
/** @internal */
const ORDERS_REMAINING_TO_AUTOSYNC_AT = 20;
/** @internal */
const NEP5_OLD_ASSETS = ['nos', 'phx', 'guard', 'lx', 'ava'];
/** @internal */
exports.MISSING_NONCES = 'missing_asset_nonces';
/** @internal */
exports.MAX_ORDERS_REACHED = 'Maximal number of orders have been reached';
/** @internal */
exports.MAX_SIGN_STATE_RECURSION = 5;
/** @internal */
exports.BIG_NUMBER_FORMAT = {
    decimalSeparator: '.',
    groupSeparator: '',
    groupSize: 50,
    prefix: ''
};
exports.UNLIMITED_APPROVAL = '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe';
class Client {
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
    constructor(opts, clientOpts = {}) {
        this._socket = null;
        this.mode = client_1.ClientMode.NONE;
        this._headers = {
            'Content-Type': 'application/json'
        };
        this._absintheSocket = null;
        this.tradedAssets = [];
        this.handleOrderPlaced = async (order) => {
            if (this.clientOpts.autoSignState &&
                order.ordersTillSignState < ORDERS_REMAINING_TO_AUTOSYNC_AT &&
                !this.signStateInProgress) {
                // console.info('Will auto sign state: ', order.ordersTillSignState)
                await this.getSignAndSyncStates();
            }
        };
        this.fillPoolFn = async (arg) => {
            const result = await this.gql.mutate({
                mutation: dhFillPool_1.DH_FIIL_POOL,
                variables: {
                    dhPublics: arg.client_dh_publics,
                    blockchain: arg.blockchain
                }
            });
            return result.data.dhFillPool;
        };
        this.opts = {
            maxEthCostPrTransaction: '0.05',
            ...opts
        };
        this.clientOpts = {
            autoSignState: true,
            runRequestsOverWebsockets: false,
            headers: {},
            ...clientOpts
        };
        this.isMainNet = this.opts.host === environments_1.EnvironmentConfiguration.production.host;
        this.web3 = new web3_1.default(this.opts.ethNetworkSettings.nodes[0]);
        if (!opts.host || (opts.host.indexOf('.') === -1 && !opts.isLocal)) {
            throw new Error(`Invalid API host '${opts.host}'`);
        }
        const protocol = opts.isLocal ? 'http' : 'https';
        let telemetrySend = async (_) => null;
        let agent;
        if (opts.isLocal) {
            agent = new http_1.default.Agent({
                keepAlive: true
            });
        }
        else {
            agent = new https_1.default.Agent({
                keepAlive: true
            });
        }
        if (!opts.isLocal && this.clientOpts.enablePerformanceTelemetry === true) {
            const telemetryUrl = 'https://telemetry.' + /^app.(.+)$/.exec(opts.host)[1];
            telemetrySend = async (data) => {
                const r = await node_fetch_1.default(telemetryUrl, {
                    method: 'post',
                    agent,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                if (r.status !== 200) {
                    throw new Error('status' + r.status);
                }
            };
        }
        this.perfClient = new nash_perf_1.PerfClient({
            tag: 'ts-api-client-' +
                (this.clientOpts.performanceTelemetryTag || 'unknown'),
            post: telemetrySend
        });
        if (!this.clientOpts.enablePerformanceTelemetry) {
            this.perfClient.measure = () => null;
        }
        this.apiUri = `${protocol}://${opts.host}/api/graphql`;
        this.wsUri = `wss://${opts.host}/api/socket`;
        this.maxEthCostPrTransaction = new bignumber_js_1.default(this.web3.utils.toWei(this.opts.maxEthCostPrTransaction));
        if (this.opts.maxEthCostPrTransaction == null ||
            isNaN(parseFloat(this.opts.maxEthCostPrTransaction))) {
            throw new Error('maxEthCostPrTransaction is invalid ' +
                this.opts.maxEthCostPrTransaction);
        }
        const network = new NeonJS.rpc.Network({
            ...this.opts.neoNetworkSettings,
            name: this.opts.neoNetworkSettings.name
        });
        NeonJS.default.add.network(network, true);
        this.ethVaultContract = new this.web3.eth.Contract(settlementABI_1.SettlementABI, this.opts.ethNetworkSettings.contracts.vault.contract);
        const query = async (params) => {
            let obj;
            if (this.mode !== client_1.ClientMode.NONE &&
                this.clientOpts.runRequestsOverWebsockets) {
                const promise = new Promise((resolve, reject) => AbsintheSocket.observe(this.getAbsintheSocket(), AbsintheSocket.send(this.getAbsintheSocket(), {
                    operation: queryPrinter_1.gqlToString(params.query),
                    variables: params.variables
                }), {
                    onResult: res => resolve(res),
                    onAbort: errs => reject(errs),
                    onError: errs => reject(errs)
                }));
                const result = await promise;
                return result;
            }
            else {
                const resp = await node_fetch_1.default(this.apiUri, {
                    method: 'POST',
                    headers: this.headers,
                    agent,
                    body: JSON.stringify({
                        query: queryPrinter_1.gqlToString(params.query),
                        variables: params.variables
                    }),
                    timeout: 30000
                });
                if (resp.status !== 200) {
                    let msg = `API error. Status code: ${resp.status}`;
                    if (resp.body) {
                        const responseContent = await resp.text();
                        msg += ` / body: ${responseContent}`;
                    }
                    throw new Error(msg);
                }
                obj = await resp.json();
                obj.headers = resp.headers;
                if (obj.errors) {
                    throw new ApolloError_1.ApolloError({
                        graphQLErrors: obj.errors
                    });
                }
            }
            return obj;
        };
        this.gql = {
            query,
            mutate: params => query({
                query: params.mutation,
                variables: params.variables
            })
        };
    }
    get headers() {
        return {
            ...this.clientOpts.headers,
            ...this._headers
        };
    }
    get affiliateDeveloperCode() {
        const { affiliateCode, affiliateLabel } = this.clientOpts;
        if (affiliateCode == null) {
            return undefined;
        }
        if (affiliateLabel == null) {
            return affiliateCode;
        }
        return `${affiliateCode}:${affiliateLabel}`;
    }
    async prefillRPoolIfNeeded(blockchain) {
        const fillRPool = this.perfClient.start('prefillRPoolIfNeeded_' + blockchain);
        await nash_protocol_1.fillRPoolIfNeeded({
            fillPoolFn: this.fillPoolFn,
            blockchain,
            paillierPkStr: this.pallierPkStr
        });
        // Ignore it delta is like 1ms or 0. Because that means no work was done
        if (fillRPool.delta() > 1) {
            fillRPool.end();
        }
    }
    async prefillRPoolIfNeededForAssets(asset1, asset2) {
        const blockchain1 = this.assetData[asset1].blockchain.toUpperCase();
        await this.prefillRPoolIfNeeded(blockchain1);
        if (asset2 == null) {
            return;
        }
        const blockchain2 = this.assetData[asset2].blockchain.toUpperCase();
        if (blockchain2 === blockchain1) {
            return;
        }
        await this.prefillRPoolIfNeeded(blockchain2);
    }
    disconnect() {
        if (this._socket == null) {
            return;
        }
        this._socket.disconnect();
        this._socket = null;
        this._absintheSocket = null;
        this._subscriptionHandlers = null;
    }
    requireMode(mode, msg) {
        if (this.mode !== mode) {
            throw new Error(msg);
        }
    }
    requireMPC() {
        this.requireMode(client_1.ClientMode.MPC, 'This feature requires logging in using an API Key');
    }
    requireFull() {
        this.requireMode(client_1.ClientMode.FULL_SECRET, 'This feature requires logging in using username / password');
    }
    _createSocket() {
        const clientHeaders = { ...this.clientOpts.headers };
        const Transport = Object.keys(clientHeaders).length === 0
            ? WebSocket
            : // tslint:disable-next-line
                class extends WebSocket {
                    constructor(endpoint) {
                        super(endpoint, undefined, undefined, clientHeaders);
                    }
                };
        const socket = new phoenix_1.Socket(this.wsUri, {
            transport: Transport,
            automaticReconnect: !this.clientOpts.disableSocketReconnect,
            decode: (rawPayload, callback) => {
                const [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
                if (payload.status === 'error') {
                    if (typeof payload.response !== 'string') {
                        payload.response = JSON.stringify(payload.response);
                    }
                }
                return callback({
                    join_ref,
                    ref,
                    topic,
                    event,
                    payload
                });
            },
            params: this.wsToken != null
                ? {
                    token: this.wsToken
                }
                : {}
        });
        socket.connect();
        return socket;
    }
    getAbsintheSocket() {
        if (this._absintheSocket != null) {
            return this._absintheSocket;
        }
        this._absintheSocket = AbsintheSocket.create(this.getSocket());
        return this._absintheSocket;
    }
    getSocket() {
        if (this._socket != null) {
            return this._socket;
        }
        this._socket = this._createSocket();
        return this._socket;
    }
    wsAuthCheck(sub) {
        if (this.wsToken == null) {
            throw new Error('To use ' +
                sub +
                ', you must login() before creating the socket connection');
        }
    }
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
    get subscriptions() {
        if (this._subscriptionHandlers) {
            return this._subscriptionHandlers;
        }
        this._subscriptionHandlers = this._createSocketConnection();
        return this._subscriptionHandlers;
    }
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
    createSocketConnection() {
        return this.subscriptions;
    }
    _createSocketConnection() {
        if (this.wsUri == null) {
            throw new Error('wsUri config parameter missing');
        }
        return {
            disconnect: () => this.disconnect(),
            socket: this.getSocket(),
            absintheSocket: this.getAbsintheSocket(),
            onUpdatedAccountOrders: async (payload, handlers) => {
                this.wsAuthCheck('onUpdatedAccountOrders');
                AbsintheSocket.observe(this.getAbsintheSocket(), AbsintheSocket.send(this.getAbsintheSocket(), {
                    operation: queryPrinter_1.gqlToString(updatedAccountOrders_1.UPDATED_ACCOUNT_ORDERS),
                    variables: {
                        payload
                    }
                }), handlers);
            },
            onUpdatedCandles: (variables, handlers) => AbsintheSocket.observe(this.getAbsintheSocket(), AbsintheSocket.send(this.getAbsintheSocket(), {
                operation: queryPrinter_1.gqlToString(updatedCandles_1.UPDATED_CANDLES),
                variables
            }), handlers),
            onUpdatedTickers: handlers => {
                AbsintheSocket.observe(this.getAbsintheSocket(), AbsintheSocket.send(this.getAbsintheSocket(), {
                    operation: queryPrinter_1.gqlToString(updatedTickers_1.UPDATED_TICKERS),
                    variables: {}
                }), handlers);
            },
            onNewTrades: (variables, handlers) => {
                AbsintheSocket.observe(this.getAbsintheSocket(), AbsintheSocket.send(this.getAbsintheSocket(), {
                    operation: queryPrinter_1.gqlToString(newTrades_1.NEW_TRADES),
                    variables
                }), handlers);
            },
            onUpdatedOrderbook: (variables, handlers) => {
                const channel = this.getSocket().channel('public_order_book:' + variables.marketName, {});
                channel
                    .join()
                    .receive('ok', initial => {
                    if (handlers.onStart) {
                        handlers.onStart({
                            data: {
                                updatedOrderBook: initial
                            }
                        });
                    }
                    if (handlers.onResult) {
                        handlers.onResult({
                            data: {
                                updatedOrderBook: initial
                            }
                        });
                    }
                    channel.on('update', update => {
                        if (handlers.onResult) {
                            handlers.onResult({
                                data: {
                                    updatedOrderBook: update
                                }
                            });
                        }
                    });
                })
                    .receive('error', resp => {
                    if (handlers.onAbort) {
                        handlers.onAbort(resp);
                    }
                    if (handlers.onError) {
                        handlers.onError(resp);
                    }
                });
            },
            onAccountTrade: async (payload, handlers) => {
                this.wsAuthCheck('onAccountTrade');
                AbsintheSocket.observe(this.getAbsintheSocket(), AbsintheSocket.send(this.getAbsintheSocket(), {
                    operation: queryPrinter_1.gqlToString(newAccountTrades_1.NEW_ACCOUNT_TRADES),
                    variables: {
                        payload
                    }
                }), handlers);
            }
        };
    }
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
    async login({ secret, apiKey }) {
        this.mode = client_1.ClientMode.MPC;
        this.authorization = `Token ${apiKey}`;
        this.wsToken = apiKey;
        this.apiKey = JSON.parse(Buffer.from(secret, 'base64').toString('utf-8'));
        this._headers = {
            'Content-Type': 'application/json',
            Authorization: this.authorization
        };
        this.disconnect();
        this.marketData = await this.fetchMarketData();
        this.nashProtocolMarketData = helpers_1.mapMarketsForNashProtocol(this.marketData);
        this.assetData = await this.fetchAssetData();
        this.pallierPkStr = JSON.stringify(this.apiKey.paillier_pk);
        this.currentOrderNonce = nash_protocol_1.createTimestamp32();
        await this.updateTradedAssetNonces();
    }
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
    async legacyLogin({ email, password, twoFaCode, walletIndices = { neo: 1, eth: 1, btc: 1 }, presetWallets, salt = '' }) {
        this.walletIndices = walletIndices;
        const keys = await nash_protocol_1.getHKDFKeysFromPassword(password, salt);
        const resp = await this.gql.mutate({
            mutation: signIn_1.SIGN_IN_MUTATION,
            variables: {
                email,
                password: keys.authKey.toString('hex')
            }
        });
        this.mode = client_1.ClientMode.FULL_SECRET;
        const cookies = set_cookie_parser_1.default.parse(set_cookie_parser_1.default.splitCookiesString(resp.headers.get('set-cookie')));
        const cookie = cookies.find(c => c.name === 'nash-cookie');
        this.casCookie = cookie.name + '=' + cookie.value;
        this._headers = {
            'Content-Type': 'application/json',
            Cookie: this.casCookie
        };
        const m = /nash-cookie=([0-9a-z-]+)/.exec(this.casCookie);
        if (m == null) {
            throw new Error('Failed to login, invalid casCookie: ' + this.casCookie);
        }
        this.wsToken = m[1];
        this.disconnect();
        if (resp.errors) {
            throw new Error(resp.errors[0].message);
        }
        this.account = resp.data.signIn.account;
        this.marketData = await this.fetchMarketData();
        this.assetData = await this.fetchAssetData();
        this.assetNonces = {};
        this.currentOrderNonce = nash_protocol_1.createTimestamp32();
        if (resp.data.signIn.twoFaRequired) {
            if (twoFaCode !== undefined) {
                this.account = await this.doTwoFactorLogin(twoFaCode);
            }
            else {
                // 2FA code is undefined. Check if needed by backend
                throw new Error('Login requires 2 factor code, but no twoFaCode argument supplied');
            }
        }
        if (this.account == null) {
            throw new Error('Failed to sign in');
        }
        if (resp.data.signIn.account.encryptedSecretKey === null) {
            console.log('keys not present in the CAS: creating and uploading as we speak.');
            await this.createAndUploadKeys(keys.encryptionKey, presetWallets);
        }
        const aead = {
            encryptedSecretKey: nash_protocol_1.bufferize(this.account.encryptedSecretKey),
            nonce: nash_protocol_1.bufferize(this.account.encryptedSecretKeyNonce),
            tag: nash_protocol_1.bufferize(this.account.encryptedSecretKeyTag)
        };
        this.initParams = {
            walletIndices: this.walletIndices,
            encryptionKey: keys.encryptionKey,
            aead,
            marketData: helpers_1.mapMarketsForNashProtocol(this.marketData),
            assetData: this.assetData
        };
        this.nashCoreConfig = await nash_protocol_1.initialize(this.initParams);
        if (this.opts.debug) {
            console.log(this.nashCoreConfig);
        }
        if (presetWallets !== undefined) {
            const cloned = { ...this.nashCoreConfig };
            cloned.wallets = presetWallets;
            this.nashCoreConfig = cloned;
        }
        this.publicKey = this.nashCoreConfig.payloadSigningKey.publicKey;
        // after login we should always try to get asset nonces
        await this.updateTradedAssetNonces();
    }
    async doTwoFactorLogin(twoFaCode) {
        const twoFaResult = await this.gql.mutate({
            mutation: twoFactorLoginMutation_1.USER_2FA_LOGIN_MUTATION,
            variables: { code: twoFaCode }
        });
        try {
            const result = twoFaResult.data.twoFactorLogin;
            const twoFAaccount = result.account;
            const wallets = {};
            twoFAaccount.wallets.forEach(w => {
                wallets[w.blockchain.toLowerCase()] = w.chainIndex;
            });
            this.walletIndices = wallets;
            return {
                encrypted_secret_key: twoFAaccount.encryptedSecretKey,
                encrypted_secret_key_nonce: twoFAaccount.encryptedSecretKeyNonce,
                encrypted_secret_key_tag: twoFAaccount.encryptedSecretKeyTag
            };
        }
        catch (e) {
            return {
                type: 'error',
                message: twoFaResult.errors
            };
        }
    }
    async createAndUploadKeys(encryptionKey, presetWallets) {
        const secretKey = nash_protocol_1.getSecretKey();
        const res = nash_protocol_1.encryptSecretKey(encryptionKey, secretKey);
        this.account.encryptedSecretKey = res.encryptedSecretKey.toString('hex');
        this.account.encryptedSecretKeyTag = res.tag.toString('hex');
        this.account.encryptedSecretKeyNonce = res.nonce.toString('hex');
        const aead = {
            encryptedSecretKey: nash_protocol_1.bufferize(this.account.encryptedSecretKey),
            nonce: nash_protocol_1.bufferize(this.account.encryptedSecretKeyNonce),
            tag: nash_protocol_1.bufferize(this.account.encryptedSecretKeyTag)
        };
        this.initParams = {
            walletIndices: this.walletIndices,
            encryptionKey,
            aead,
            marketData: helpers_1.mapMarketsForNashProtocol(this.marketData),
            assetData: this.assetData
        };
        this.nashCoreConfig = await nash_protocol_1.initialize(this.initParams);
        if (presetWallets !== undefined) {
            const cloned = { ...this.nashCoreConfig };
            cloned.wallets = presetWallets;
            this.nashCoreConfig = cloned;
        }
        this.publicKey = this.nashCoreConfig.payloadSigningKey.publicKey;
        await this.gql.mutate({
            mutation: addKeysWithWallets_1.ADD_KEYS_WITH_WALLETS_MUTATION,
            variables: {
                encryptedSecretKey: array_buffer_to_hex_1.default(this.initParams.aead.encryptedSecretKey),
                encryptedSecretKeyNonce: array_buffer_to_hex_1.default(this.initParams.aead.nonce),
                encryptedSecretKeyTag: array_buffer_to_hex_1.default(this.initParams.aead.tag),
                signaturePublicKey: this.nashCoreConfig.payloadSigningKey.publicKey,
                wallets: [
                    {
                        address: this.nashCoreConfig.wallets.neo.address,
                        blockchain: 'NEO',
                        publicKey: this.nashCoreConfig.wallets.neo.publicKey,
                        chainIndex: this.nashCoreConfig.wallets.neo.index
                            ? this.nashCoreConfig.wallets.neo.index
                            : 0
                    },
                    {
                        address: this.nashCoreConfig.wallets.eth.address,
                        blockchain: 'ETH',
                        publicKey: this.nashCoreConfig.wallets.eth.publicKey,
                        chainIndex: this.nashCoreConfig.wallets.eth.index
                            ? this.nashCoreConfig.wallets.eth.index
                            : 0
                    },
                    {
                        address: this.nashCoreConfig.wallets.btc.address,
                        blockchain: 'BTC',
                        publicKey: this.nashCoreConfig.wallets.btc.publicKey,
                        chainIndex: this.nashCoreConfig.wallets.btc.index
                            ? this.nashCoreConfig.wallets.btc.index
                            : 0
                    }
                ]
            }
        });
    }
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
    async getTicker(marketName) {
        utils_1.checkMandatoryParams({ marketName, Type: 'string' });
        const result = await this.gql.query({
            query: getTicker_1.GET_TICKER,
            variables: { marketName }
        });
        return result.data.getTicker;
        // if(payload.type === "error") return payload
        // return ticker
    }
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
    async getOrderBook(marketName) {
        utils_1.checkMandatoryParams({ marketName, Type: 'string' });
        const result = await this.gql.query({
            query: getOrderBook_1.GET_ORDERBOOK,
            variables: { marketName }
        });
        return result.data.getOrderBook;
    }
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
    async listTrades({ marketName, limit, before }) {
        utils_1.checkMandatoryParams({ marketName, Type: 'string' });
        const result = await this.gql.query({
            query: listTrades_1.LIST_TRADES,
            variables: { marketName, limit, before }
        });
        return result.data.listTrades;
    }
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
    async listTickers() {
        const result = await this.gql.query({
            query: listTickers_1.LIST_TICKERS
        });
        return result.data.listTickers;
    }
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
    async listAssets() {
        const result = await this.gql.query({
            query: listAsset_1.LIST_ASSETS_QUERY
        });
        return result.data.listAssets;
    }
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
    async getAccountVolumes() {
        const result = await this.gql.query({
            query: getAccountVolumes_1.GET_ACCOUNT_VOLUMES,
            variables: {
                payload: {}
            }
        });
        return result.data.getAccountVolumes;
    }
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
    async listCandles({ marketName, before, interval, limit }) {
        utils_1.checkMandatoryParams({ marketName, Type: 'string' });
        const result = await this.gql.query({
            query: listCandles_1.LIST_CANDLES,
            variables: { marketName, before, interval, limit }
        });
        return result.data.listCandles;
    }
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
    async listMarkets() {
        const result = await this.gql.query({
            query: listMarkets_1.LIST_MARKETS_QUERY
        });
        return result.data.listMarkets;
    }
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
    async getMarket(marketName) {
        utils_1.checkMandatoryParams({ marketName, Type: 'string' });
        const result = await this.gql.query({
            query: getMarket_1.GET_MARKET_QUERY,
            variables: { marketName }
        });
        return result.data.getMarkets;
    }
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
    async listAccountOrders({ before, buyOrSell, limit, marketName, rangeStart, rangeStop, status, type, shouldIncludeTrades } = {}) {
        const query = shouldIncludeTrades
            ? listAccountOrders_1.LIST_ACCOUNT_ORDERS_WITH_TRADES
            : listAccountOrders_1.LIST_ACCOUNT_ORDERS;
        const result = await this.gql.query({
            query,
            variables: {
                payload: {
                    before,
                    buyOrSell,
                    limit,
                    marketName,
                    rangeStart,
                    rangeStop,
                    status,
                    type
                }
            }
        });
        return result.data.listAccountOrders;
    }
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
    async listAccountTrades({ before, limit, marketName } = {}) {
        const result = await this.gql.query({
            query: listAccountTrades_1.LIST_ACCOUNT_TRADES,
            variables: {
                payload: {
                    before,
                    limit,
                    marketName
                }
            }
        });
        return result.data.listAccountTrades;
    }
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
    async listAccountTransactions({ cursor, fiatSymbol, limit } = {}) {
        const result = await this.gql.query({
            query: listAccountTransactions_1.LIST_ACCOUNT_TRANSACTIONS,
            variables: {
                payload: {
                    cursor,
                    fiatSymbol,
                    limit
                }
            }
        });
        return result.data.listAccountTransactions;
    }
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
    async listAccountBalances(ignoreLowBalance) {
        const result = await this.gql.query({
            query: listAccountBalances_1.LIST_ACCOUNT_BALANCES,
            variables: {
                payload: { ignoreLowBalance }
            }
        });
        return result.data.listAccountBalances;
    }
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
    async getAccountAddress(currency) {
        utils_1.checkMandatoryParams({ currency, Type: 'string' });
        const result = await this.gql.query({
            query: getAccountAddress_1.GET_ACCOUNT_ADDRESS,
            variables: {
                payload: { currency }
            }
        });
        return result.data.getAccountAddress;
    }
    /**
     * @param  {CryptoCurrency} currency [description]
     * @return {Promise}                 [description]
     *
     * @deprecated will be removed in next major version use getAccountAddress
     */
    getDepositAddress(currency) {
        return this.getAccountAddress(currency);
    }
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
    async getAccountPortfolio({ fiatSymbol, period } = {}) {
        const result = await this.gql.query({
            query: getAccountPortfolio_1.GET_ACCOUNT_PORTFOLIO,
            variables: {
                payload: {
                    fiatSymbol,
                    period
                }
            }
        });
        return result.data.getAccountPortfolio;
    }
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
    async getMovement(movementID) {
        const getMovemementParams = {
            payload: {
                movement_id: movementID,
                timestamp: nash_protocol_1.createTimestamp()
            },
            kind: nash_protocol_1.SigningPayloadID.getMovementPayload
        };
        const signedPayload = await this.signPayload(getMovemementParams);
        const result = await this.gql.query({
            query: getMovement_1.GET_MOVEMENT,
            variables: {
                payload: signedPayload.payload,
                signature: signedPayload.signature
            }
        });
        return result.data.getMovement;
    }
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
    async getAccountBalance(currency) {
        utils_1.checkMandatoryParams({ currency, Type: 'string' });
        const result = await this.gql.query({
            query: getAccountBalance_1.GET_ACCOUNT_BALANCE,
            variables: {
                payload: { currency }
            }
        });
        return result.data.getAccountBalance;
    }
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
    async getAccountOrder(orderId) {
        utils_1.checkMandatoryParams({ orderId, Type: 'string' });
        const result = await this.gql.query({
            query: getAccountOrder_1.GET_ACCOUNT_ORDER,
            variables: {
                payload: { orderId }
            }
        });
        return result.data.getAccountOrder;
    }
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
    async listMovements({ currency, status, type }) {
        const listMovementParams = nash_protocol_1.createListMovementsParams(currency, status, type);
        const signedPayload = await this.signPayload(listMovementParams);
        const result = await this.gql.query({
            query: listMovements_1.LIST_MOVEMENTS,
            variables: {
                payload: signedPayload.payload,
                signature: signedPayload.signature
            }
        });
        return result.data.listMovements;
    }
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
    async getAssetNonces(assetList) {
        const getAssetNoncesParams = nash_protocol_1.createGetAssetsNoncesParams(assetList);
        const signedPayload = await this.signPayload(getAssetNoncesParams);
        const result = await this.gql.query({
            query: nonces_1.GET_ASSETS_NONCES_QUERY,
            variables: {
                payload: signedPayload.payload,
                signature: signedPayload.signature
            }
        });
        return result.data.getAssetsNonces;
    }
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
    async getSignAndSyncStates(sync = false) {
        this.signStateInProgress = true;
        const emptyStates = {
            states: [],
            recycledOrders: [],
            serverSignedStates: []
        };
        const signStatesRecursive = await this.signStates(emptyStates);
        this.signStateInProgress = false;
        if (sync) {
            const syncResult = await this.syncStates(signStatesRecursive);
            return syncResult;
        }
        return signStatesRecursive;
    }
    state_map_from_states(states) {
        return states.map(state => {
            return {
                blockchain: state.blockchain,
                message: state.message
            };
        });
    }
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
    async signStates(getStatesData, depth = 0) {
        if (depth > exports.MAX_SIGN_STATE_RECURSION) {
            throw new Error('Max sign state recursion reached.');
        }
        const signStatesMeasure = this.perfClient.start('signStates');
        const signStateListPayload = nash_protocol_1.createSignStatesParams(this.state_map_from_states(getStatesData.states), this.state_map_from_states(getStatesData.recycledOrders));
        const signedStates = await this.signPayload(signStateListPayload);
        try {
            const result = await this.gql.mutate({
                mutation: stateSyncing_1.SIGN_STATES_MUTATION,
                variables: {
                    payload: signedStates.signedPayload,
                    signature: signedStates.signature
                }
            });
            const signStatesData = result.data;
            // this is the response, we will send them in to be signed in the next recursive call
            const states_requiring_signing = this.state_map_from_states(signStatesData.signStates.states);
            // this is all the server signed states.  We don't really use/need these but it is good
            // for the client to have them
            const all_server_signed_states = getStatesData.serverSignedStates.concat(this.state_map_from_states(signStatesData.signStates.serverSignedStates));
            // keep a list of all states that have been signed so we can sync them
            const all_states_to_sync = getStatesData.states.concat(states_requiring_signing);
            // if input states to be signed are different than result, and that list has a length
            // we recursively call this method until the signStates calls are exhausted
            // with a max recursion depth of 5
            if (states_requiring_signing !== getStatesData.states &&
                states_requiring_signing.length > 0) {
                const recursiveStates = {
                    states: states_requiring_signing,
                    recycledOrders: signStatesData.signStates.recycledOrders,
                    serverSignedStates: all_server_signed_states
                };
                return this.signStates(recursiveStates, depth + 1);
            }
            // the result should have all the states that were signed by the server
            // and all the states signed by the client in order to call syncStates
            signStatesData.signStates.serverSignedStates = all_server_signed_states;
            signStatesData.signStates.states = all_states_to_sync;
            if (depth === 0) {
                signStatesMeasure.end();
            }
            return signStatesData;
        }
        catch (e) {
            console.error('Could not sign states: ', e);
            return e;
        }
    }
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
    async syncStates(signStatesData) {
        const stateList = signStatesData.signStates.serverSignedStates.map(state => {
            return {
                blockchain: state.blockchain,
                message: state.message
            };
        });
        const syncStatesParams = nash_protocol_1.createSyncStatesParams(stateList);
        const signedPayload = await this.signPayload(syncStatesParams);
        const result = await this.gql.mutate({
            mutation: stateSyncing_1.SYNC_STATES_MUTATION,
            variables: {
                payload: signedPayload.payload,
                signature: signedPayload.signature
            }
        });
        // after syncing states, we should always update asset nonces
        await this.updateTradedAssetNonces();
        return result.data.syncStates;
    }
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
    async cancelOrder(orderID, marketName) {
        const m1 = this.perfClient.start('cancelOrder');
        const m2 = this.perfClient.start('cancelOrder_' + marketName);
        const [a, b] = marketName.split('_');
        await this.prefillRPoolIfNeededForAssets(a, b);
        const cancelOrderParams = nash_protocol_1.createCancelOrderParams(orderID, marketName);
        const signedPayload = await this.signPayload(cancelOrderParams);
        const result = await this.gql.mutate({
            mutation: cancelOrder_1.CANCEL_ORDER_MUTATION,
            variables: {
                payload: signedPayload.payload,
                signature: signedPayload.signature
            }
        });
        const cancelledOrder = result.data.cancelOrder;
        m1.end();
        m2.end();
        return cancelledOrder;
    }
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
    async cancelAllOrders(marketName) {
        const m1 = this.perfClient.start('cancelAllOrders');
        const m2 = this.perfClient.start('cancelAllOrders_' + (marketName || 'all'));
        let cancelAllOrderParams = {
            timestamp: nash_protocol_1.createTimestamp()
        };
        if (marketName !== undefined) {
            cancelAllOrderParams = {
                marketName,
                timestamp: nash_protocol_1.createTimestamp()
            };
        }
        const payloadAndKind = {
            kind: nash_protocol_1.SigningPayloadID.cancelAllOrdersPayload,
            payload: cancelAllOrderParams
        };
        const signedPayload = await this.signPayload(payloadAndKind);
        const result = await this.gql.mutate({
            mutation: cancelAllOrders_1.CANCEL_ALL_ORDERS_MUTATION,
            variables: {
                payload: signedPayload.payload,
                signature: signedPayload.signature
            }
        });
        const cancelledOrder = result.data.cancelAllOrders.accepted;
        m1.end();
        m2.end();
        return cancelledOrder;
    }
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
    async placeLimitOrder(allowTaker, amount, buyOrSell, cancellationPolicy, limitPrice, marketName, cancelAt) {
        const measurementPlaceOrder = this.perfClient.start('placeLimitOrder');
        const measurementPlaceLimitOrder = this.perfClient.start('placeLimitOrder_' + marketName);
        utils_1.checkMandatoryParams({
            allowTaker,
            Type: 'boolean'
        }, {
            amount,
            limitPrice,
            Type: 'object'
        }, {
            cancellationPolicy,
            buyOrSell,
            marketName,
            Type: 'string'
        });
        const { nonceOrder, noncesFrom, noncesTo } = this.getNoncesForTrade(marketName, buyOrSell);
        const normalizedAmount = helpers_1.normalizeAmountForMarket(amount, this.marketData[marketName]);
        const normalizedLimitPrice = helpers_1.normalizePriceForMarket(limitPrice, this.marketData[marketName]);
        await this.prefillRPoolIfNeededForAssets(limitPrice.currencyA, limitPrice.currencyB);
        const placeLimitOrderParams = nash_protocol_1.createPlaceLimitOrderParams(allowTaker, normalizedAmount, buyOrSell, cancellationPolicy, normalizedLimitPrice, marketName, noncesFrom, noncesTo, nonceOrder, cancelAt);
        const measurementSignPayload = this.perfClient.start('signPayloadLimitOrder_' + marketName);
        const signedPayload = await this.signPayload(placeLimitOrderParams);
        measurementSignPayload.end();
        try {
            const result = await this.gql.mutate({
                mutation: placeLimitOrder_1.PLACE_LIMIT_ORDER_MUTATION,
                variables: {
                    affiliateDeveloperCode: this.affiliateDeveloperCode,
                    payload: signedPayload.signedPayload,
                    signature: signedPayload.signature
                }
            });
            measurementPlaceOrder.end();
            measurementPlaceLimitOrder.end();
            await this.handleOrderPlaced(result.data.placeLimitOrder);
            return result.data.placeLimitOrder;
        }
        catch (e) {
            let replaceOrder = false;
            if (e.message.includes(exports.MISSING_NONCES)) {
                replaceOrder = true;
                await this.updateTradedAssetNonces();
            }
            else if (e.message.includes(exports.MAX_ORDERS_REACHED)) {
                if (this.clientOpts.autoSignState && !this.signStateInProgress) {
                    replaceOrder = true;
                    await this.getSignAndSyncStates();
                }
            }
            if (replaceOrder) {
                return await this.placeLimitOrder(allowTaker, amount, buyOrSell, cancellationPolicy, limitPrice, marketName, cancelAt);
            }
            return this.handleOrderError(e, signedPayload);
        }
    }
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
    async placeMarketOrder(amount, buyOrSell, marketName) {
        const measurementPlaceOrder = this.perfClient.start('placeMarketOrder');
        const measurementPlaceMarketOrder = this.perfClient.start('placeMarketOrder_' + marketName);
        utils_1.checkMandatoryParams({
            buyOrSell,
            marketName,
            Type: 'string'
        });
        const { nonceOrder, noncesFrom, noncesTo } = this.getNoncesForTrade(marketName, buyOrSell);
        const normalizedAmount = helpers_1.normalizeAmountForMarket(amount, this.marketData[marketName]);
        const [a, b] = marketName.split('_');
        await this.prefillRPoolIfNeededForAssets(a, b);
        const placeMarketOrderParams = nash_protocol_1.createPlaceMarketOrderParams(normalizedAmount, buyOrSell, marketName, noncesFrom, noncesTo, nonceOrder);
        const measurementSignPayload = this.perfClient.start('signPayloadMarketOrder_' + marketName);
        const signedPayload = await this.signPayload(placeMarketOrderParams);
        measurementSignPayload.end();
        try {
            const result = await this.gql.mutate({
                mutation: placeMarketOrder_1.PLACE_MARKET_ORDER_MUTATION,
                variables: {
                    affiliateDeveloperCode: this.affiliateDeveloperCode,
                    payload: signedPayload.signedPayload,
                    signature: signedPayload.signature
                }
            });
            measurementPlaceOrder.end();
            measurementPlaceMarketOrder.end();
            await this.handleOrderPlaced(result.data.placeMarketOrder);
            return result.data.placeMarketOrder;
        }
        catch (e) {
            let replaceOrder = false;
            if (e.message.includes(exports.MISSING_NONCES)) {
                replaceOrder = true;
                await this.updateTradedAssetNonces();
            }
            else if (e.message.includes(exports.MAX_ORDERS_REACHED)) {
                if (this.clientOpts.autoSignState && !this.signStateInProgress) {
                    replaceOrder = true;
                    await this.getSignAndSyncStates();
                }
            }
            if (replaceOrder) {
                return await this.placeMarketOrder(amount, buyOrSell, marketName);
            }
            return this.handleOrderError(e, signedPayload);
        }
    }
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
    async placeStopLimitOrder(allowTaker, amount, buyOrSell, cancellationPolicy, limitPrice, marketName, stopPrice, cancelAt) {
        const measurementPlaceOrder = this.perfClient.start('placeStopLimitOrder');
        const measurementPlaceMarketOrder = this.perfClient.start('placeStopLimitOrder_' + marketName);
        utils_1.checkMandatoryParams({ allowTaker, Type: 'boolean' }, { buyOrSell, marketName, cancellationPolicy, Type: 'string' }, { cancelAt: 'number' });
        const { nonceOrder, noncesFrom, noncesTo } = this.getNoncesForTrade(marketName, buyOrSell);
        const normalizedAmount = helpers_1.normalizeAmountForMarket(amount, this.marketData[marketName]);
        const normalizedLimitPrice = helpers_1.normalizePriceForMarket(limitPrice, this.marketData[marketName]);
        const normalizedStopPrice = helpers_1.normalizePriceForMarket(stopPrice, this.marketData[marketName]);
        await this.prefillRPoolIfNeededForAssets(limitPrice.currencyA, limitPrice.currencyB);
        const placeStopLimitOrderParams = nash_protocol_1.createPlaceStopLimitOrderParams(allowTaker, normalizedAmount, buyOrSell, cancellationPolicy, normalizedLimitPrice, marketName, normalizedStopPrice, noncesFrom, noncesTo, nonceOrder, cancelAt);
        const measurementSignPayload = this.perfClient.start('signPayloadStopLimitOrder_' + marketName);
        const signedPayload = await this.signPayload(placeStopLimitOrderParams);
        measurementSignPayload.end();
        try {
            const result = await this.gql.mutate({
                mutation: placeStopLimitOrder_1.PLACE_STOP_LIMIT_ORDER_MUTATION,
                variables: {
                    affiliateDeveloperCode: this.affiliateDeveloperCode,
                    payload: signedPayload.signedPayload,
                    signature: signedPayload.signature
                }
            });
            measurementPlaceOrder.end();
            measurementPlaceMarketOrder.end();
            await this.handleOrderPlaced(result.data.placeStopLimitOrder);
            return result.data.placeStopLimitOrder;
        }
        catch (e) {
            let replaceOrder = false;
            if (e.message.includes(exports.MISSING_NONCES)) {
                replaceOrder = true;
                await this.updateTradedAssetNonces();
            }
            else if (e.message.includes(exports.MAX_ORDERS_REACHED)) {
                if (this.clientOpts.autoSignState && !this.signStateInProgress) {
                    replaceOrder = true;
                    await this.getSignAndSyncStates();
                }
            }
            if (replaceOrder) {
                return await this.placeStopLimitOrder(allowTaker, amount, buyOrSell, cancellationPolicy, limitPrice, marketName, stopPrice, cancelAt);
            }
            return this.handleOrderError(e, signedPayload);
        }
    }
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
    async placeStopMarketOrder(amount, buyOrSell, marketName, stopPrice) {
        const measurementPlaceOrder = this.perfClient.start('placeStopMarketOrder');
        const measurementPlaceMarketOrder = this.perfClient.start('placeStopMarketOrder_' + marketName);
        utils_1.checkMandatoryParams({ amount, stopPrice, Type: 'object' }, { buyOrSell, marketName, Type: 'string' });
        const { nonceOrder, noncesFrom, noncesTo } = this.getNoncesForTrade(marketName, buyOrSell);
        const normalizedAmount = helpers_1.normalizeAmountForMarket(amount, this.marketData[marketName]);
        const normalizedStopPrice = helpers_1.normalizePriceForMarket(stopPrice, this.marketData[marketName]);
        const [a, b] = marketName.split('_');
        await this.prefillRPoolIfNeededForAssets(a, b);
        const placeStopMarketOrderParams = nash_protocol_1.createPlaceStopMarketOrderParams(normalizedAmount, buyOrSell, marketName, normalizedStopPrice, noncesFrom, noncesTo, nonceOrder);
        const measurementSignPayload = this.perfClient.start('signPayloadStopMarketOrder_' + marketName);
        const signedPayload = await this.signPayload(placeStopMarketOrderParams);
        measurementSignPayload.end();
        try {
            const result = await this.gql.mutate({
                mutation: placeStopMarketOrder_1.PLACE_STOP_MARKET_ORDER_MUTATION,
                variables: {
                    affiliateDeveloperCode: this.affiliateDeveloperCode,
                    payload: signedPayload.signedPayload,
                    signature: signedPayload.signature
                }
            });
            measurementPlaceOrder.end();
            measurementPlaceMarketOrder.end();
            await this.handleOrderPlaced(result.data.placeStopMarketOrder);
            return result.data.placeStopMarketOrder;
        }
        catch (e) {
            let replaceOrder = false;
            if (e.message.includes(exports.MISSING_NONCES)) {
                replaceOrder = true;
                await this.updateTradedAssetNonces();
            }
            else if (e.message.includes(exports.MAX_ORDERS_REACHED)) {
                if (this.clientOpts.autoSignState && !this.signStateInProgress) {
                    replaceOrder = true;
                    await this.getSignAndSyncStates();
                }
            }
            if (replaceOrder) {
                return await this.placeStopMarketOrder(amount, buyOrSell, marketName, stopPrice);
            }
            return this.handleOrderError(e, signedPayload);
        }
    }
    handleOrderError(error, signedPayload) {
        if (error.message.includes(exports.MISSING_NONCES)) {
            this.updateTradedAssetNonces();
            throw new types_1.MissingNonceError(error.message, signedPayload);
        }
        else if (error.message.includes('Insufficient Funds')) {
            throw new types_1.InsufficientFundsError(error.message, signedPayload);
        }
        throw new Error(`Could not place order: ${error.message} using payload: ${JSON.stringify(signedPayload.blockchain_raw)}`);
    }
    /**
     * Used by our internal trading bot
     * @param  {string}                      address
     * @param  {CurrencyAmount}              quantity
     * @param  {MovementType}                type
     * @return {Promise<SignMovementResult>}
     */
    async legacyAddMovement(address, quantity, type) {
        this.requireFull();
        const prepareMovementMovementParams = nash_protocol_1.createPrepareMovementParams(address, quantity, type);
        const preparePayload = await this.signPayload(prepareMovementMovementParams);
        const result = await this.gql.mutate({
            mutation: prepareMovement_1.PREPARE_MOVEMENT_MUTATION,
            variables: {
                payload: preparePayload.payload,
                signature: preparePayload.signature
            }
        });
        const movementPayloadParams = nash_protocol_1.createAddMovementParams(address, quantity, type, result.data.prepareMovement.nonce, null, result.data.prepareMovement.recycledOrders, result.data.prepareMovement.transactionElements);
        const signedMovement = await this.signPayload(movementPayloadParams);
        const payload = { ...signedMovement.payload };
        payload.signedTransactionElements =
            signedMovement.signedPayload.signed_transaction_elements;
        payload.resignedOrders = payload.recycled_orders;
        delete payload.digests;
        delete payload.recycled_orders;
        delete payload.blockchainSignatures;
        const addMovementResult = await this.gql.mutate({
            mutation: addMovementMutation_1.ADD_MOVEMENT_MUTATION,
            variables: {
                payload,
                signature: signedMovement.signature
            }
        });
        // after deposit or withdrawal we want to update nonces
        await this.updateTradedAssetNonces();
        return {
            result: addMovementResult.data.addMovement,
            blockchain_data: signedMovement.blockchain_data
        };
    }
    async queryAllowance(assetData) {
        let approvalPower = assetData.blockchainPrecision;
        if (assetData.symbol === currency_1.CryptoCurrency.USDC) {
            approvalPower = this.isMainNet ? 6 : 18;
        }
        const erc20Contract = new this.web3.eth.Contract(erc20ABI_1.Erc20ABI, `0x${assetData.hash}`);
        try {
            const res = await erc20Contract.methods
                .allowance(`0x${this.apiKey.child_keys[nash_protocol_1.BIP44.ETH].address}`, this.opts.ethNetworkSettings.contracts.vault.contract)
                .call();
            return new bignumber_js_1.default(res).div(Math.pow(10, approvalPower));
        }
        catch (e) {
            return new bignumber_js_1.default(0);
        }
    }
    validateTransactionCost(gasPrice, estimate) {
        const maxCost = new bignumber_js_1.default(gasPrice).multipliedBy(estimate);
        if (this.maxEthCostPrTransaction.lt(maxCost)) {
            throw new Error('Transaction ETH cost larger than maxEthCostPrTransaction (' +
                this.opts.maxEthCostPrTransaction +
                ')');
        }
    }
    async approveERC20Transaction(asset, childKey, _amount) {
        for (let i = 0; i < 5; i++) {
            try {
                const chainId = await this.web3.eth.net.getId();
                const erc20Contract = await new this.web3.eth.Contract(erc20ABI_1.Erc20ABI, '0x' + asset.hash);
                const approveAbi = erc20Contract.methods
                    .approve(this.opts.ethNetworkSettings.contracts.vault.contract, exports.UNLIMITED_APPROVAL)
                    .encodeABI();
                const ethApproveNonce = await this.web3.eth.getTransactionCount('0x' + childKey.address);
                const nonce = '0x' + ethApproveNonce.toString(16);
                const estimate = await this.web3.eth.estimateGas({
                    from: '0x' + this.apiKey.child_keys[nash_protocol_1.BIP44.ETH].address,
                    nonce: ethApproveNonce,
                    to: '0x' + asset.hash,
                    data: approveAbi
                });
                const gasPrice = await this.web3.eth.getGasPrice();
                this.validateTransactionCost(gasPrice, estimate);
                const approveTx = new ethereumjs_tx_1.Transaction({
                    nonce,
                    gasPrice: '0x' + parseInt(gasPrice, 10).toString(16),
                    gasLimit: '0x' + estimate.toString(16),
                    to: '0x' + asset.hash,
                    value: 0,
                    data: approveAbi
                });
                approveTx.getChainId = () => chainId;
                const approveSignature = await this.signEthTransaction(approveTx);
                ethUtils_1.setEthSignature(approveTx, approveSignature);
                const p = await this.web3.eth.sendSignedTransaction('0x' + approveTx.serialize().toString('hex'));
                return p;
            }
            catch (e) {
                console.info('Error approving tx: ', e.message);
                if (e.message === 'Returned error: replacement transaction underpriced') {
                    // console.log('approve failed, retrying approve in 15 seconds')
                    await utils_1.sleep(15000);
                    continue;
                }
                else if (e.message.inde) {
                    throw e;
                }
            }
        }
        throw new Error('Failed to approve erc20 token');
    }
    async approveAndAwaitAllowance(assetData, childKey, amount) {
        const bnAmount = new bignumber_js_1.default(amount);
        const currentAllowance = await this.queryAllowance(assetData);
        if (currentAllowance.lt(bnAmount)) {
            console.info('Will approve allowance');
            await this.approveERC20Transaction(assetData, childKey, bnAmount.minus(currentAllowance));
            // We will wait for allowance for up to 20 minutes. After which I think we should time out.
            for (let i = 0; i < 20 * 12 * 4; i++) {
                const latestAllowance = await this.queryAllowance(assetData);
                if (latestAllowance.gte(bnAmount)) {
                    return;
                }
                await utils_1.sleep(5000);
            }
            throw new Error('Eth approval timed out');
        }
        else {
            console.info('Already has enough approved');
        }
    }
    async transferToExternal(params) {
        this.requireMPC();
        const { quantity: { currency, amount }, address } = params;
        console.info(`Will try sending to address ${address}: ${amount} of ${currency}`);
        if (this.assetData == null) {
            throw new Error('Asset data null');
        }
        if (this.assetData[currency] == null) {
            throw new Error('Invalid asset: ' + currency);
        }
        const assetData = this.assetData[currency];
        const blockchain = assetData.blockchain;
        if (this.opts.host === environments_1.EnvironmentConfiguration.production.host) {
            const addrBlockchain = utils_1.detectBlockchain(address);
            if (addrBlockchain === null) {
                throw new Error(`We can't infer blockchain type from address ${address}. If you think this is an error please report it.`);
            }
            if (addrBlockchain !== blockchain) {
                throw new Error(`You are attempted to send a ${blockchain} asset, but address is infered to be ${addrBlockchain}`);
            }
        }
        const childKey = this.apiKey.child_keys[BLOCKCHAIN_TO_BIP44[blockchain.toUpperCase()]];
        switch (blockchain) {
            case 'eth':
                const chainId = await this.web3.eth.net.getId();
                const ethAccountNonce = await this.web3.eth.getTransactionCount('0x' + childKey.address);
                const value = currency === currency_1.CryptoCurrency.ETH ? this.web3.utils.toWei(amount) : '0';
                let data = '';
                if (currency !== currency_1.CryptoCurrency.ETH) {
                    const erc20Contract = new this.web3.eth.Contract(erc20ABI_1.Erc20ABI, `0x${assetData.hash}`);
                    const externalAmount = ethUtils_1.transferExternalGetAmount(new bignumber_js_1.default(amount), assetData, this.isMainNet);
                    data = erc20Contract.methods
                        .transfer(ethUtils_1.prefixWith0xIfNeeded(address), this.web3.utils.numberToHex(externalAmount))
                        .encodeABI();
                }
                const gasPrice = await this.web3.eth.getGasPrice();
                const estimate = await this.web3.eth.estimateGas({
                    from: ethUtils_1.prefixWith0xIfNeeded(this.apiKey.child_keys[nash_protocol_1.BIP44.ETH].address),
                    nonce: ethAccountNonce,
                    to: ethUtils_1.prefixWith0xIfNeeded(currency === currency_1.CryptoCurrency.ETH
                        ? '0x7C291eB2D2Ec9A35dba0e2C395c5928cd7d90e51'
                        : assetData.hash),
                    value,
                    data
                });
                this.validateTransactionCost(gasPrice, estimate);
                const ethTx = new ethereumjs_tx_1.Transaction({
                    nonce: '0x' + ethAccountNonce.toString(16),
                    gasPrice: '0x' + parseInt(gasPrice, 10).toString(16),
                    gasLimit: '0x' + estimate.toString(16),
                    to: ethUtils_1.prefixWith0xIfNeeded(currency !== currency_1.CryptoCurrency.ETH ? assetData.hash : address),
                    value: '0x' + parseInt(value, 10).toString(16),
                    data: data === '' ? undefined : data
                });
                ethTx.getChainId = () => chainId;
                const ethTxSignature = await this.signEthTransaction(ethTx);
                ethUtils_1.setEthSignature(ethTx, ethTxSignature);
                const receipt = await this.web3.eth.sendSignedTransaction('0x' + ethTx.serialize().toString('hex'));
                return {
                    txId: receipt.transactionHash,
                    gasUsed: receipt.gasUsed
                };
            case 'neo':
                let transaction;
                const nodes = this.opts.neoNetworkSettings.nodes.reverse();
                const node = await utils_1.findBestNetworkNode(nodes);
                const rpcClient = new NeonJS.rpc.RPCClient(node);
                const balance = await NeonJS.api.neoscan.getBalance(this.opts.neoScan, childKey.address);
                if (currency === currency_1.CryptoCurrency.NEO ||
                    currency === currency_1.CryptoCurrency.GAS) {
                    transaction = NeonJS.default.create
                        .contractTx()
                        .addIntent(currency.toUpperCase(), new neon_core_1.u.Fixed8(amount, 10), address);
                }
                else {
                    const sendAmount = parseFloat(amount) * 1e8;
                    const timestamp = new bignumber_js_1.default(nash_protocol_1.createTimestamp32()).toString(16);
                    transaction = new neon_core_1.tx.InvocationTransaction({
                        script: NeonJS.default.create.script({
                            scriptHash: assetData.hash,
                            operation: 'transfer',
                            args: [
                                neon_core_1.sc.ContractParam.byteArray(childKey.address, 'address'),
                                neon_core_1.sc.ContractParam.byteArray(address, 'address'),
                                neon_core_1.sc.ContractParam.integer(sendAmount)
                            ]
                        }),
                        gas: 0
                    })
                        .addAttribute(neon_core_1.tx.TxAttrUsage.Script, neon_core_1.u.reverseHex(neon_core_1.wallet.getScriptHashFromAddress(childKey.address)))
                        .addAttribute(neon_core_1.tx.TxAttrUsage.Remark, timestamp);
                }
                transaction.calculate(balance);
                const payload = transaction.serialize(false);
                const signature = await this.signNeoPayload(payload.toLowerCase());
                transaction.addWitness(neon_core_1.tx.Witness.fromSignature(signature, childKey.public_key));
                const neoStatus = await rpcClient.sendRawTransaction(transaction.serialize(true));
                if (!neoStatus) {
                    throw new Error('Could not send neo');
                }
                return {
                    txId: transaction.hash
                };
            case 'btc':
                const pubKey = Buffer.from(childKey.public_key, 'hex');
                const externalTransferAmount = new bignumber_js_1.default(amount).toNumber();
                const { vins } = await this.getAccountAddress(currency_1.CryptoCurrency.BTC);
                const utxos = vins.map(vin => {
                    if (vin.value == null || vin.txid == null || vin.n == null) {
                        throw new Error('Invalid vin');
                    }
                    return {
                        txid: vin.txid,
                        vout: vin.n,
                        value: vin.value.amount,
                        height: 0
                    };
                });
                const btcGasPrice = await btcUtils_1.calculateFeeRate();
                const fee = btcUtils_1.calculateBtcFees(externalTransferAmount, btcGasPrice, utxos);
                const net = btcUtils_1.networkFromName(this.opts.btcNetworkSettings.name);
                const btcTx = new bitcoin.Psbt({ network: net });
                let utxoInputTotal = fee.times(-1);
                utxos.forEach(utxo => {
                    utxoInputTotal = utxoInputTotal.plus(utxo.value);
                });
                let useAll = false;
                if (utxoInputTotal.toFixed(8) === new bignumber_js_1.default(amount).toFixed(8)) {
                    useAll = true;
                }
                const transferAmount = Math.round(new bignumber_js_1.default(amount).times(btcUtils_1.BTC_SATOSHI_MULTIPLIER).toNumber());
                const p2wpkh = bitcoin.payments.p2wpkh({
                    network: net,
                    pubkey: pubKey
                });
                // this payment is used by the p2sh payment
                const p2shPayment = bitcoin.payments.p2sh({
                    network: net,
                    redeem: p2wpkh
                });
                // this is the redeemScript used for the P2SH
                // It is of format 00 14 hash160(pubkey)
                if (p2shPayment.redeem == null || p2shPayment.redeem.output == null) {
                    throw new Error('Invalid p2shPayment');
                }
                const redeem = p2shPayment.redeem.output;
                // we recostruct the scriptPubkey from the redeem script
                // the format is 79 14 hash160(redeem) 87
                const myScript = Buffer.from(btcUtils_1.P2shP2wpkhScript(redeem));
                const allUtxo = utxos.map(utxo => ({
                    ...utxo,
                    txId: utxo.txid,
                    value: new bignumber_js_1.default(utxo.value)
                        .times(btcUtils_1.BTC_SATOSHI_MULTIPLIER)
                        .toNumber()
                }));
                let inputs;
                let outputs;
                if (useAll) {
                    inputs = allUtxo;
                    outputs = [{ address, value: transferAmount }];
                }
                else {
                    // Calculate inputs and outputs using coin selection algorithm
                    const result = coinselect_1.default(allUtxo, [{ address, value: transferAmount }], btcGasPrice);
                    inputs = result.inputs;
                    outputs = result.outputs;
                }
                if (!inputs || !outputs) {
                    throw new Error('Insufficient funds');
                }
                for (const input of inputs) {
                    const txInput = {
                        hash: input.txId,
                        index: input.vout,
                        witnessUtxo: {
                            script: myScript,
                            value: input.value
                        },
                        redeemScript: redeem
                    };
                    // console.info("added input: ", txInput)
                    btcTx.addInput(txInput);
                }
                for (const output of outputs) {
                    btcTx.addOutput({
                        address: output.address || childKey.address,
                        value: output.value
                    });
                }
                // Sign all inputs and build transaction
                const uTx = btcTx.data.globalMap.unsignedTx;
                const uutx = uTx.tx;
                const presignatures = [];
                for (let i = 0; i < inputs.length; i++) {
                    // The function body of sign has been extracted as we want to sign this in our mpc way
                    const { hash, sighashType } = btcUtils_1.getHashAndSighashType(btcTx.data.inputs, i, pubKey, btcTx.__CACHE, [bitcoin.Transaction.SIGHASH_ALL]);
                    const btcPayloadPresig = await nash_protocol_1.computePresig({
                        apiKey: {
                            client_secret_share: childKey.client_secret_share,
                            paillier_pk: this.apiKey.paillier_pk,
                            public_key: childKey.public_key,
                            server_secret_share_encrypted: childKey.server_secret_share_encrypted
                        },
                        blockchain: nash_protocol_1.Blockchain.BTC,
                        fillPoolFn: this.fillPoolFn,
                        messageHash: hash.toString('hex')
                    });
                    presignatures.push({
                        sighashType,
                        presig: {
                            signature: btcPayloadPresig.presig,
                            r: btcPayloadPresig.r,
                            amount: inputs[i].value
                        }
                    });
                }
                const completeBtcTransactionPayload = {
                    payload: uutx.toBuffer().toString('hex'),
                    publicKey: childKey.public_key,
                    inputPresigs: presignatures.map(p => p.presig)
                };
                const completedInputSignatures = await this.completeBtcTransactionSignatures(completeBtcTransactionPayload);
                for (let i = 0; i < presignatures.length; i++) {
                    const partialSig = [
                        {
                            pubkey: pubKey,
                            signature: bitcoin.script.signature.encode(Buffer.from(completedInputSignatures[i].slice(0, completedInputSignatures[i].length - 2), 'hex'), presignatures[i].sighashType)
                        }
                    ];
                    btcTx.data.updateInput(i, { partialSig });
                    btcTx.validateSignaturesOfInput(i);
                }
                btcTx.finalizeAllInputs();
                const signedRawBtcTx = btcTx.extractTransaction().toHex();
                const btcTxResult = await this.sendBlockchainRawTransaction({
                    payload: signedRawBtcTx,
                    blockchain: nash_protocol_1.Blockchain.BTC
                });
                return {
                    txId: btcTxResult
                };
            default:
                throw new Error('Unsupported blockchain ' + assetData.blockchain);
        }
    }
    async signNeoPayload(payload) {
        const messageHash = neon_core_1.u.sha256(payload);
        const childKey = this.apiKey.child_keys[nash_protocol_1.BIP44.NEO];
        const payloadPresig = await nash_protocol_1.computePresig({
            apiKey: {
                client_secret_share: childKey.client_secret_share,
                paillier_pk: this.apiKey.paillier_pk,
                public_key: childKey.public_key,
                server_secret_share_encrypted: childKey.server_secret_share_encrypted
            },
            blockchain: nash_protocol_1.Blockchain.NEO,
            fillPoolFn: this.fillPoolFn,
            messageHash
        });
        const signature = await this.completePayloadSignature({
            blockchain: nash_protocol_1.Blockchain.NEO,
            payload,
            public_key: childKey.public_key,
            signature: payloadPresig.presig,
            type: completeSignature_1.CompletePayloadSignatureType.Blockchain,
            r: payloadPresig.r
        });
        if (!neon_core_1.wallet.verify(payload, signature, childKey.public_key)) {
            throw new Error('Completed signature not correct');
        }
        return signature;
    }
    async signEthTransaction(etx) {
        const childKey = this.apiKey.child_keys[nash_protocol_1.BIP44.ETH];
        const txSignature = await nash_protocol_1.computePresig({
            apiKey: {
                client_secret_share: childKey.client_secret_share,
                paillier_pk: this.apiKey.paillier_pk,
                public_key: childKey.public_key,
                server_secret_share_encrypted: childKey.server_secret_share_encrypted
            },
            blockchain: nash_protocol_1.Blockchain.ETH,
            fillPoolFn: this.fillPoolFn,
            messageHash: etx.hash(false).toString('hex')
        });
        const payload = ethUtils_1.serializeEthTx(etx);
        const invocationSignature = await this.completePayloadSignature({
            blockchain: nash_protocol_1.Blockchain.ETH,
            payload: payload.toLowerCase(),
            public_key: childKey.public_key,
            signature: txSignature.presig,
            type: completeSignature_1.CompletePayloadSignatureType.Blockchain,
            r: txSignature.r
        });
        return invocationSignature;
    }
    depositToTradingContract(quantity) {
        return this.transferToTradingContract(quantity, nash_protocol_1.MovementTypeDeposit);
    }
    withdrawFromTradingContract(quantity) {
        return this.transferToTradingContract(quantity, nash_protocol_1.MovementTypeWithdrawal);
    }
    async prepareMovement(payload) {
        const signature = await this.signPayload({
            kind: nash_protocol_1.SigningPayloadID.prepareMovementPayload,
            payload: {
                ...payload,
                timestamp: new Date().getTime()
            }
        });
        const data = await this.gql.mutate({
            mutation: prepareMovement_1.PREPARE_MOVEMENT_MUTATION,
            variables: {
                payload: signature.payload,
                signature: signature.signature
            }
        });
        return data.data.prepareMovement;
    }
    async updateMovement(payload) {
        const signature = await this.signPayload({
            kind: nash_protocol_1.SigningPayloadID.updateMovementPayload,
            payload: {
                ...payload,
                timestamp: new Date().getTime()
            }
        });
        const data = await this.gql.mutate({
            mutation: updateMovement_1.UPDATE_MOVEMENT_MUTATION,
            variables: {
                payload: signature.payload,
                signature: signature.signature
            }
        });
        return data.data.updateMovement;
    }
    transferToTradingContract(quantity, movementType) {
        const promise = new promievent_1.default((resolve, reject) => this._transferToTradingContract(quantity, movementType, (...args) => promise.emit(...args))
            .then(resolve)
            .catch(reject));
        return promise;
    }
    async isMovementCompleted(movementId) {
        const movement = await this.getMovement(movementId);
        return movement.status === types_1.MovementStatus.COMPLETED;
    }
    async _transferToTradingContract(quantity, movementType, emit) {
        this.requireMPC();
        if (this.assetData == null) {
            throw new Error('Asset data null');
        }
        if (this.assetData[quantity.currency] == null) {
            throw new Error('Invalid asset: ' + quantity.currency);
        }
        const assetData = this.assetData[quantity.currency];
        const blockchain = assetData.blockchain;
        const childKey = this.apiKey.child_keys[BLOCKCHAIN_TO_BIP44[blockchain.toUpperCase()]];
        const address = childKey.address;
        const bnAmount = new bignumber_js_1.default(quantity.amount);
        let preparedMovement;
        let movementAmount = bnAmount;
        const prepareAMovement = async () => {
            const params = {
                address,
                quantity: {
                    amount: bnAmount.toFormat(8, bignumber_js_1.default.ROUND_FLOOR, exports.BIG_NUMBER_FORMAT),
                    currency: assetData.symbol
                },
                type: movementType
            };
            preparedMovement = await this.prepareMovement(params);
            movementAmount = bnAmount;
            if (quantity.currency === currency_1.CryptoCurrency.BTC &&
                movementType === nash_protocol_1.MovementTypeWithdrawal) {
                const withdrawalFee = new bignumber_js_1.default(preparedMovement.fees.amount);
                movementAmount = bnAmount.plus(withdrawalFee);
            }
        };
        await prepareAMovement();
        let signedAddMovementPayload;
        let addMovementResult;
        while (true) {
            signedAddMovementPayload = await this.signPayload({
                payload: {
                    address: childKey.address,
                    nonce: preparedMovement.nonce,
                    quantity: {
                        amount: movementAmount.toFormat(8, bignumber_js_1.default.ROUND_FLOOR, exports.BIG_NUMBER_FORMAT),
                        currency: assetData.symbol
                    },
                    type: movementType,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    recycled_orders: preparedMovement.recycledOrders.map(({ blockchain: orderBlockchain, message }) => ({
                        blockchain: orderBlockchain,
                        message
                    })),
                    digests: preparedMovement.transactionElements.map(({ blockchain: txBlockchain, digest: digest }) => ({
                        blockchain: txBlockchain,
                        digest
                    })),
                    timestamp: new Date().getTime()
                },
                kind: nash_protocol_1.SigningPayloadID.addMovementPayload
            });
            const sanitizedPayload = utils_1.sanitizeAddMovementPayload(signedAddMovementPayload.signedPayload);
            try {
                addMovementResult = await this.gql.mutate({
                    mutation: addMovementMutation_1.ADD_MOVEMENT_MUTATION,
                    variables: {
                        payload: sanitizedPayload,
                        signature: signedAddMovementPayload.signature
                    }
                });
                emit('movement', addMovementResult.data.addMovement);
                emit('signature', signedAddMovementPayload);
                break;
            }
            catch (e) {
                if (!e.message.startsWith('GraphQL error: ')) {
                    throw e;
                }
                const blockchainError = e.message.slice('GraphQL error: '.length);
                switch (blockchainError) {
                    case movements_1.BlockchainError.PREPARE_MOVEMENT_MUST_BE_CALLED_FIRST:
                    case movements_1.BlockchainError.BAD_NONCE:
                        // console.log('preparing movement again')
                        await utils_1.sleep(15000);
                        await prepareAMovement();
                        break;
                    default:
                        throw e;
                }
            }
        }
        if (quantity.currency === currency_1.CryptoCurrency.BTC) {
            return {
                txId: addMovementResult.data.addMovement.id.toString(),
                movementId: addMovementResult.data.addMovement.id.toString()
            };
        }
        const blockchainSignature = await this.completePayloadSignature({
            blockchain: blockchain.toUpperCase(),
            payload: signedAddMovementPayload.blockchain_raw.toLowerCase(),
            public_key: childKey.public_key,
            signature: signedAddMovementPayload.blockchain_data.userSig,
            type: completeSignature_1.CompletePayloadSignatureType.Movement,
            r: signedAddMovementPayload.blockchain_data.r
        });
        emit('blockchainSignature', blockchainSignature);
        const resp = await this.updateDepositWithdrawalMovementWithTx({
            blockchainSignature,
            movement: addMovementResult.data.addMovement,
            signedAddMovementPayload
        });
        return {
            txId: resp.txId,
            movementId: addMovementResult.data.addMovement.id
        };
    }
    async findPendingChainMovements(chain) {
        return (await this.listMovements({
            status: types_1.MovementStatus.PENDING
        })).filter(movement => {
            return (this.assetData[movement.currency] != null &&
                this.assetData[movement.currency].blockchain === chain);
        });
    }
    resumeTradingContractTransaction(unfinishedTransaction) {
        let resolve;
        let reject;
        const out = new promievent_1.default((a, b) => {
            resolve = a;
            reject = b;
        });
        this._resumeVaultTransaction(unfinishedTransaction, out.emit.bind(out))
            .then(resolve)
            .catch(reject);
        return out;
    }
    async _resumeVaultTransaction(unfinishedTransaction, emit) {
        const { movement, signature: signedAddMovementPayload } = unfinishedTransaction;
        const assetData = this.assetData[movement.currency];
        const blockchain = assetData.blockchain;
        const childKey = this.apiKey.child_keys[BLOCKCHAIN_TO_BIP44[blockchain.toUpperCase()]];
        const blockchainSignature = unfinishedTransaction.blockchainSignature ||
            (await this.completePayloadSignature({
                blockchain: blockchain.toUpperCase(),
                payload: signedAddMovementPayload.blockchain_raw.toLowerCase(),
                public_key: childKey.public_key,
                signature: signedAddMovementPayload.blockchain_data.userSig,
                type: completeSignature_1.CompletePayloadSignatureType.Movement,
                r: signedAddMovementPayload.blockchain_data.r
            }));
        emit('blockchainSignature', blockchainSignature);
        const resp = await this.updateDepositWithdrawalMovementWithTx({
            movement,
            signedAddMovementPayload,
            blockchainSignature
        });
        return resp;
    }
    async updateDepositWithdrawalMovementWithTx({ movement, signedAddMovementPayload, blockchainSignature }) {
        const movementType = movement.type;
        const quantity = signedAddMovementPayload.payload.quantity;
        const bnAmount = new bignumber_js_1.default(quantity.amount);
        const assetData = this.assetData[movement.currency];
        const blockchain = assetData.blockchain;
        const childKey = this.apiKey.child_keys[BLOCKCHAIN_TO_BIP44[blockchain.toUpperCase()]];
        switch (blockchain) {
            case 'eth':
                if (blockchain === types_1.Blockchain.ETH &&
                    movementType === nash_protocol_1.MovementTypeDeposit &&
                    quantity.currency !== currency_1.CryptoCurrency.ETH) {
                    console.log('approving erc20');
                    await this.approveAndAwaitAllowance(assetData, childKey, quantity.amount);
                }
                const { address: scriptAddress, asset, amount: scriptAmount, nonce } = signedAddMovementPayload.blockchain_data;
                const chainId = await this.web3.eth.net.getId();
                const scriptAmountDecimal = parseInt(scriptAmount, 10);
                const amountHex = scriptAmountDecimal.toString(16);
                let value = '0';
                if (quantity.currency === currency_1.CryptoCurrency.ETH &&
                    movementType === nash_protocol_1.MovementTypeDeposit) {
                    value = this.web3.utils.toWei(quantity.amount);
                }
                const args = [
                    '0x' + scriptAddress,
                    '0x' + asset,
                    '0x' + amountHex,
                    '0x' + nonce,
                    '0x' + scriptAddress,
                    '0x' + blockchainSignature,
                    '0x' + movement.signature
                ];
                const invocation = movementType === nash_protocol_1.MovementTypeDeposit
                    ? this.ethVaultContract.methods.deposit(...args)
                    : this.ethVaultContract.methods.sharedWithdrawal(...args);
                const abi = invocation.encodeABI();
                const ethAccountNonce = await this.web3.eth.getTransactionCount('0x' + childKey.address);
                const gasPrice = await this.web3.eth.getGasPrice();
                const estimate = await this.web3.eth.estimateGas({
                    from: '0x' + childKey.address,
                    nonce: ethAccountNonce,
                    gasPrice: '0x' + parseInt(gasPrice, 10).toString(16),
                    value: '0x' + parseInt(value, 10).toString(16),
                    to: this.opts.ethNetworkSettings.contracts.vault.contract,
                    data: abi
                });
                this.validateTransactionCost(gasPrice, estimate);
                const movementTx = new ethereumjs_tx_1.Transaction({
                    nonce: '0x' + ethAccountNonce.toString(16),
                    gasPrice: '0x' + parseInt(gasPrice, 10).toString(16),
                    gasLimit: '0x' + (estimate * 2).toString(16),
                    to: this.opts.ethNetworkSettings.contracts.vault.contract,
                    value: '0x' + parseInt(value, 10).toString(16),
                    data: abi
                });
                movementTx.getChainId = () => chainId;
                const invocationSignature = await this.signEthTransaction(movementTx);
                ethUtils_1.setEthSignature(movementTx, invocationSignature);
                const serializedEthTx = movementTx.serialize().toString('hex');
                const hash = movementTx.hash().toString('hex');
                // const pendingEthMovements = await this.findPendingChainMovements(
                //   TSAPIBlockchain.ETH
                // )
                await new Promise((resolve, reject) => {
                    const pe = this.web3.eth.sendSignedTransaction('0x' + serializedEthTx);
                    pe.once('transactionHash', resolve);
                    pe.once('error', reject);
                });
                await this.updateMovement({
                    movementId: movement.id,
                    status: types_1.MovementStatus.PENDING,
                    transactionHash: hash.toLowerCase(),
                    transactionPayload: serializedEthTx.toLowerCase(),
                    fee: (parseInt(gasPrice, 10) * estimate * 2).toString()
                });
                return {
                    txId: ethUtils_1.prefixWith0xIfNeeded(hash)
                };
            case 'neo':
                const timestamp = new bignumber_js_1.default(nash_protocol_1.createTimestamp32()).toString(16);
                const balance = await NeonJS.api.neoscan.getBalance(this.opts.neoScan, childKey.address);
                const builder = new neon_core_1.sc.ScriptBuilder();
                builder.emitAppCall(this.opts.neoNetworkSettings.contracts.vault.contract, movementType === nash_protocol_1.MovementTypeDeposit ? 'deposit' : 'sharedWithdrawal', [
                    new neon_core_1.sc.ContractParam('ByteArray', signedAddMovementPayload.blockchain_data.prefix),
                    new neon_core_1.sc.ContractParam('ByteArray', signedAddMovementPayload.blockchain_data.address),
                    new neon_core_1.sc.ContractParam('ByteArray', signedAddMovementPayload.blockchain_data.asset),
                    new neon_core_1.sc.ContractParam('ByteArray', signedAddMovementPayload.blockchain_data.amount),
                    new neon_core_1.sc.ContractParam('ByteArray', signedAddMovementPayload.blockchain_data.nonce),
                    new neon_core_1.sc.ContractParam('ByteArray', signedAddMovementPayload.blockchain_data.userPubKey),
                    new neon_core_1.sc.ContractParam('ByteArray', movement.publicKey),
                    new neon_core_1.sc.ContractParam('ByteArray', blockchainSignature),
                    new neon_core_1.sc.ContractParam('ByteArray', movement.signature)
                ]);
                let sendingFromSmartContract = false;
                const neoTransaction = new neon_core_1.tx.InvocationTransaction({
                    script: builder.str,
                    gas: 0
                }).addAttribute(neon_core_1.tx.TxAttrUsage.Script, neon_core_1.u.reverseHex(neon_core_1.wallet.getScriptHashFromAddress(childKey.address)));
                if (movementType === nash_protocol_1.MovementTypeWithdrawal &&
                    NEP5_OLD_ASSETS.includes(quantity.currency)) {
                    sendingFromSmartContract = true;
                    neoTransaction.addAttribute(neon_core_1.tx.TxAttrUsage.Script, neon_core_1.u.reverseHex(this.opts.neoNetworkSettings.contracts.vault.contract));
                }
                if (movementType === nash_protocol_1.MovementTypeDeposit &&
                    (quantity.currency === currency_1.CryptoCurrency.NEO ||
                        quantity.currency === currency_1.CryptoCurrency.GAS)) {
                    neoTransaction.addIntent(quantity.currency.toUpperCase(), bnAmount.toNumber(), this.opts.neoNetworkSettings.contracts.vault.address);
                }
                neoTransaction
                    .addAttribute(neon_core_1.tx.TxAttrUsage.Remark, timestamp)
                    .calculate(balance);
                const payload = neoTransaction.serialize(false);
                const signature = await this.signNeoPayload(payload.toLowerCase());
                neoTransaction.addWitness(neon_core_1.tx.Witness.fromSignature(signature, childKey.public_key));
                if (sendingFromSmartContract) {
                    const acct = new neon_core_1.wallet.Account(childKey.address);
                    if (parseInt(this.opts.neoNetworkSettings.contracts.vault.contract, 16) > parseInt(acct.scriptHash, 16)) {
                        neoTransaction.scripts.push(new neon_core_1.tx.Witness({
                            invocationScript: '0000',
                            verificationScript: ''
                        }));
                    }
                    else {
                        neoTransaction.scripts.unshift(new neon_core_1.tx.Witness({
                            invocationScript: '0000',
                            verificationScript: ''
                        }));
                    }
                }
                const signedNeoPayload = neoTransaction.serialize(true);
                await this.updateMovement({
                    movementId: movement.id,
                    status: types_1.MovementStatus.PENDING,
                    transactionHash: neoTransaction.hash.toLowerCase(),
                    transactionPayload: signedNeoPayload.toLowerCase(),
                    fee: neoTransaction.fees.toString()
                });
                return {
                    txId: neoTransaction.hash
                };
            default:
                throw new Error('not implemented');
        }
    }
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
    async signWithdrawRequest(address, quantity, nonce) {
        const signMovementParams = nash_protocol_1.createAddMovementParams(address, quantity, nash_protocol_1.MovementTypeWithdrawal, nonce);
        const signedPayload = await this.signPayload(signMovementParams);
        const result = await this.gql.mutate({
            mutation: addMovementMutation_1.ADD_MOVEMENT_MUTATION,
            variables: {
                payload: signedPayload.payload,
                signature: signedPayload.signature
            }
        });
        // after deposit or withdrawal we want to update nonces
        await this.updateTradedAssetNonces();
        return {
            result: result.data.addMovement,
            blockchain_data: signedPayload.blockchain_data
        };
    }
    /**
     * helper function that returns the correct types for the needed GQL queries
     * and mutations.
     *
     * @param [SigningPayloadID]
     * @param payload
     * @returns
     */
    signPayload(payloadAndKind) {
        switch (this.mode) {
            case client_1.ClientMode.NONE:
                throw new Error('Not logged in');
            case client_1.ClientMode.FULL_SECRET:
                return this.signPayloadFull(payloadAndKind);
            case client_1.ClientMode.MPC:
                return this.signPayloadMpc(payloadAndKind);
        }
    }
    async signPayloadMpc(payloadAndKind) {
        const m = this.perfClient.start('signPayloadMpc');
        this.requireMPC();
        const signedPayload = await nash_protocol_1.preSignPayload(this.apiKey, payloadAndKind, {
            fillPoolFn: this.fillPoolFn,
            assetData: this.assetData,
            marketData: this.nashProtocolMarketData
        });
        const out = {
            payload: payloadAndKind.payload,
            signature: {
                publicKey: this.apiKey.payload_public_key,
                signedDigest: signedPayload.signature
            },
            blockchain_data: signedPayload.blockchainMovement,
            blockchain_raw: signedPayload.blockchainRaw,
            signedPayload: signedPayload.payload
        };
        m.end();
        return out;
    }
    async signPayloadFull(payloadAndKind) {
        const m = this.perfClient.start('signPayload');
        this.requireFull();
        const privateKey = Buffer.from(this.nashCoreConfig.payloadSigningKey.privateKey, 'hex');
        const signedPayload = nash_protocol_1.signPayload(privateKey, payloadAndKind, this.nashCoreConfig);
        m.end();
        return {
            payload: payloadAndKind.payload,
            signature: {
                publicKey: this.publicKey,
                signedDigest: signedPayload.signature
            },
            blockchain_data: signedPayload.blockchainMovement,
            blockchain_raw: signedPayload.blockchainRaw,
            signedPayload: signedPayload.payload
        };
    }
    async updateTradedAssetNonces() {
        const nonces = await this.getAssetNonces(this.tradedAssets);
        const assetNonces = {};
        nonces.forEach(item => {
            assetNonces[item.asset] = item.nonces;
        });
        this.assetNonces = assetNonces;
    }
    getNoncesForTrade(marketName, direction) {
        try {
            const pairs = marketName.split('_');
            const unitA = pairs[0];
            const unitB = pairs[1];
            this.currentOrderNonce = this.currentOrderNonce + 1;
            let noncesTo = this.assetNonces[unitA];
            let noncesFrom = this.assetNonces[unitB];
            if (direction === types_1.OrderBuyOrSell.SELL) {
                noncesTo = this.assetNonces[unitB];
                noncesFrom = this.assetNonces[unitA];
            }
            return {
                noncesTo,
                noncesFrom,
                nonceOrder: this.currentOrderNonce
            };
        }
        catch (e) {
            console.info(`Could not get nonce set: ${e}`);
            return e;
        }
    }
    async fetchMarketData() {
        if (this.opts.debug) {
            console.log('fetching latest exchange market data');
        }
        const markets = await this.listMarkets();
        const marketAssets = [];
        if (markets) {
            const marketData = {};
            let market;
            for (const it of Object.keys(markets)) {
                market = markets[it];
                marketData[market.name] = market;
                if (!marketAssets.includes(market.aUnit)) {
                    marketAssets.push(market.aUnit);
                }
                if (!marketAssets.includes(market.bUnit)) {
                    marketAssets.push(market.bUnit);
                }
            }
            this.tradedAssets = marketAssets;
            return marketData;
        }
        else {
            throw new Error('Could not fetch markets');
        }
    }
    async completeBtcTransactionSignatures(params) {
        const resp = await this.gql.mutate({
            mutation: completeBTCTransacitonSignatures_1.COMPLETE_BTC_TRANSACTION_SIGNATURES,
            variables: params
        });
        return resp.data.completeBtcPayloadSignature;
    }
    async sendBlockchainRawTransaction(params) {
        const signedPayload = await this.signPayload(nash_protocol_1.createSendBlockchainRawTransactionParams(params.blockchain, params.payload));
        const resp = await this.gql.mutate({
            mutation: sendBlockchainRawTransaction_1.SEND_BLOCKCHAIN_RAW_TRANSACTION,
            variables: {
                payload: signedPayload.payload,
                signature: signedPayload.signature
            }
        });
        return resp.data.sendBlockchainRawTransaction;
    }
    async completePayloadSignature(params) {
        const resp = await this.gql.mutate({
            mutation: completeSignature_1.COMPLETE_PAYLOAD_SIGNATURE,
            variables: params
        });
        return resp.data.completePayloadSignature.signature;
    }
    async fetchAssetData() {
        const assetList = {};
        const assets = await this.listAssets();
        for (const a of assets) {
            assetList[a.symbol] = {
                hash: a.hash,
                precision: 8,
                symbol: a.symbol,
                blockchainPrecision: a.blockchainPrecision,
                blockchain: a.blockchain
            };
        }
        return assetList;
    }
    getNeoAddress() {
        return this.apiKey.child_keys[nash_protocol_1.BIP44.NEO].address;
    }
    getEthAddress() {
        return ethUtils_1.prefixWith0xIfNeeded(this.apiKey.child_keys[nash_protocol_1.BIP44.ETH].address);
    }
    getBtcAddress() {
        return this.apiKey.child_keys[nash_protocol_1.BIP44.BTC].address;
    }
}
exports.Client = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudC9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQWtEO0FBQ2xELHdEQUFxRDtBQUNyRCwwRUFBeUM7QUFDekMsNERBQThCO0FBQzlCLDhFQUF1QztBQUN2QyxrREFBeUI7QUFDekIsZ0RBQXVCO0FBQ3ZCLDREQUE2QztBQUM3Qyw0REFBbUM7QUFDbkMsdURBQXdDO0FBQ3hDLDREQUFtQztBQUNuQyxxREFBeUQ7QUFFekQsaURBQTZEO0FBQzdELGdEQUF1QjtBQUV2QixnRUFBb0M7QUFDcEMsK0NBQTJDO0FBQzNDLCtEQUFrRTtBQUNsRSwyREFBOEQ7QUFDOUQsd0ZBR21EO0FBQ25ELDBFQUkyQztBQUMzQywwRUFHMkM7QUFDM0MsNEVBSTZDO0FBQzdDLGdGQUE4RTtBQUM5RSw0RUFBMEU7QUFDMUUscUVBRzBDO0FBQzFDLDRFQUEwRTtBQUMxRSxzRUFBb0U7QUFDcEUsaUVBQThEO0FBQzlELDJEQUF3RDtBQUN4RCxpRUFBdUU7QUFDdkUseUVBQWdGO0FBRWhGLHdGQUdvRDtBQUVwRCx3REFJb0M7QUFFcEMsZ0ZBSWdEO0FBRWhELG9FQUcyQztBQUMzQywrREFBNEQ7QUFDNUQsNkRBQTJFO0FBQzNFLGlFQUE4RDtBQUM5RCx5RUFBZ0Y7QUFDaEYsMkVBQWtGO0FBQ2xGLGlGQUF5RjtBQUN6RixtRkFBMkY7QUFDM0Ysb0ZBQWtGO0FBQ2xGLDRFQUkrQztBQUMvQywwRUFJOEM7QUFFOUMsZ0ZBRytDO0FBQy9DLDBEQUE4RDtBQUU5RCx3RUFBc0U7QUFDdEUsZ0ZBQThFO0FBQzlFLHlFQUF5RTtBQUN6RSwwREFBdUQ7QUFDdkQsb0VBQWlFO0FBQ2pFLG9FQUFpRTtBQUVqRSx3REFJZ0M7QUFDaEMsOENBSTBCO0FBRTFCLG1DQU1nQjtBQUVoQiw0REFNa0M7QUFFbEMsMEVBSzJDO0FBRTNDLHdHQUkwRDtBQUUx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