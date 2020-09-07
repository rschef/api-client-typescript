import * as AbsintheSocket from '@absinthe/socket';
import { PerfClient } from '@neon-exchange/nash-perf';
import setCookie from 'set-cookie-parser';
import fetch from 'node-fetch';
import toHex from 'array-buffer-to-hex';
import https from 'https';
import http from 'http';
import * as NeonJS from '@cityofzion/neon-js';
import Promievent from 'promievent';
import * as bitcoin from 'bitcoinjs-lib';
import coinSelect from 'coinselect';
import { u, tx, sc, wallet } from '@cityofzion/neon-core';
import { Transaction as EthTransaction } from 'ethereumjs-tx';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { ApolloError } from './ApolloError';
import { LIST_MARKETS_QUERY } from '../queries/market/listMarkets';
import { GET_MARKET_QUERY } from '../queries/market/getMarket';
import { LIST_ACCOUNT_TRANSACTIONS } from '../queries/account/listAccountTransactions';
import { LIST_ACCOUNT_ORDERS, LIST_ACCOUNT_ORDERS_WITH_TRADES } from '../queries/order/listAccountOrders';
import { LIST_ACCOUNT_TRADES } from '../queries/trade/listAccountTrades';
import { GET_ACCOUNT_ADDRESS } from '../queries/account/getAccountAddress';
import { LIST_ACCOUNT_BALANCES } from '../queries/account/listAccountBalances';
import { GET_ACCOUNT_VOLUMES } from '../queries/account/getAccountVolumes';
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
// import { UPDATED_ORDER_BOOK } from '../subscriptions/updatedOrderBook'
import { NEW_TRADES } from '../subscriptions/newTrades';
import { UPDATED_TICKERS } from '../subscriptions/updatedTickers';
import { UPDATED_CANDLES } from '../subscriptions/updatedCandles';
import { DH_FIIL_POOL } from '../mutations/dhFillPool';
import { GET_ASSETS_NONCES_QUERY } from '../queries/nonces';
import { checkMandatoryParams, detectBlockchain, findBestNetworkNode, sleep, sanitizeAddMovementPayload } from './utils';
import { SIGN_STATES_MUTATION, SYNC_STATES_MUTATION } from '../mutations/stateSyncing';
import { CompletePayloadSignatureType, COMPLETE_PAYLOAD_SIGNATURE } from '../mutations/mpc/completeSignature';
import { COMPLETE_BTC_TRANSACTION_SIGNATURES } from '../mutations/mpc/completeBTCTransacitonSignatures';
import { SEND_BLOCKCHAIN_RAW_TRANSACTION } from '../mutations/blockchain/sendBlockchainRawTransaction';
import { normalizePriceForMarket, mapMarketsForNashProtocol, normalizeAmountForMarket } from '../helpers';
import { OrderBuyOrSell, MovementStatus, Blockchain as TSAPIBlockchain, MissingNonceError, InsufficientFundsError } from '../types';
import { ClientMode } from '../types/client';
import { BlockchainError } from './movements';
import { gqlToString } from './queryPrinter';
import { CryptoCurrency } from '../constants/currency';
import { BIP44, Blockchain, bufferize, computePresig, createAddMovementParams, createCancelOrderParams, createGetAssetsNoncesParams, createListMovementsParams, createPlaceLimitOrderParams, createPlaceMarketOrderParams, createPlaceStopLimitOrderParams, createPlaceStopMarketOrderParams, createPrepareMovementParams, createSendBlockchainRawTransactionParams, createSignStatesParams, createSyncStatesParams, createTimestamp, createTimestamp32, encryptSecretKey, getHKDFKeysFromPassword, getSecretKey, initialize, MovementTypeDeposit, MovementTypeWithdrawal, preSignPayload, SigningPayloadID, signPayload, fillRPoolIfNeeded } from '@neon-exchange/nash-protocol';
import { prefixWith0xIfNeeded, setEthSignature, transferExternalGetAmount, serializeEthTx } from './ethUtils';
import { SettlementABI } from './abi/eth/settlementABI';
import { Erc20ABI } from './abi/eth/erc20ABI';
import { calculateBtcFees, BTC_SATOSHI_MULTIPLIER, networkFromName, calculateFeeRate, P2shP2wpkhScript, getHashAndSighashType } from './btcUtils';
export * from './environments';
import { EnvironmentConfiguration } from './environments';
import { Socket as PhoenixSocket } from '../client/phoenix';
const WebSocket = require('websocket').w3cwebsocket;
/** @internal */
const BLOCKCHAIN_TO_BIP44 = {
    [Blockchain.ETH]: BIP44.ETH,
    [Blockchain.BTC]: BIP44.BTC,
    [Blockchain.NEO]: BIP44.NEO
};
/** @internal */
const ORDERS_REMAINING_TO_AUTOSYNC_AT = 20;
/** @internal */
const NEP5_OLD_ASSETS = ['nos', 'phx', 'guard', 'lx', 'ava'];
/** @internal */
export const MISSING_NONCES = 'missing_asset_nonces';
/** @internal */
export const MAX_ORDERS_REACHED = 'Maximal number of orders have been reached';
/** @internal */
export const MAX_SIGN_STATE_RECURSION = 5;
/** @internal */
export const BIG_NUMBER_FORMAT = {
    decimalSeparator: '.',
    groupSeparator: '',
    groupSize: 50,
    prefix: ''
};
export const UNLIMITED_APPROVAL = '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe';
export class Client {
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
        this.mode = ClientMode.NONE;
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
                mutation: DH_FIIL_POOL,
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
        this.isMainNet = this.opts.host === EnvironmentConfiguration.production.host;
        this.web3 = new Web3(this.opts.ethNetworkSettings.nodes[0]);
        if (!opts.host || (opts.host.indexOf('.') === -1 && !opts.isLocal)) {
            throw new Error(`Invalid API host '${opts.host}'`);
        }
        const protocol = opts.isLocal ? 'http' : 'https';
        let telemetrySend = async (_) => null;
        let agent;
        if (opts.isLocal) {
            agent = new http.Agent({
                keepAlive: true
            });
        }
        else {
            agent = new https.Agent({
                keepAlive: true
            });
        }
        if (!opts.isLocal && this.clientOpts.enablePerformanceTelemetry === true) {
            const telemetryUrl = 'https://telemetry.' + /^app.(.+)$/.exec(opts.host)[1];
            telemetrySend = async (data) => {
                const r = await fetch(telemetryUrl, {
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
        this.perfClient = new PerfClient({
            tag: 'ts-api-client-' +
                (this.clientOpts.performanceTelemetryTag || 'unknown'),
            post: telemetrySend
        });
        if (!this.clientOpts.enablePerformanceTelemetry) {
            this.perfClient.measure = () => null;
        }
        this.apiUri = `${protocol}://${opts.host}/api/graphql`;
        this.wsUri = `wss://${opts.host}/api/socket`;
        this.maxEthCostPrTransaction = new BigNumber(this.web3.utils.toWei(this.opts.maxEthCostPrTransaction));
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
        this.ethVaultContract = new this.web3.eth.Contract(SettlementABI, this.opts.ethNetworkSettings.contracts.vault.contract);
        const query = async (params) => {
            let obj;
            if (this.mode !== ClientMode.NONE &&
                this.clientOpts.runRequestsOverWebsockets) {
                const promise = new Promise((resolve, reject) => AbsintheSocket.observe(this.getAbsintheSocket(), AbsintheSocket.send(this.getAbsintheSocket(), {
                    operation: gqlToString(params.query),
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
                const resp = await fetch(this.apiUri, {
                    method: 'POST',
                    headers: this.headers,
                    agent,
                    body: JSON.stringify({
                        query: gqlToString(params.query),
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
                    throw new ApolloError({
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
        await fillRPoolIfNeeded({
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
        this.requireMode(ClientMode.MPC, 'This feature requires logging in using an API Key');
    }
    requireFull() {
        this.requireMode(ClientMode.FULL_SECRET, 'This feature requires logging in using username / password');
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
        const socket = new PhoenixSocket(this.wsUri, {
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
                    operation: gqlToString(UPDATED_ACCOUNT_ORDERS),
                    variables: {
                        payload
                    }
                }), handlers);
            },
            onUpdatedCandles: (variables, handlers) => AbsintheSocket.observe(this.getAbsintheSocket(), AbsintheSocket.send(this.getAbsintheSocket(), {
                operation: gqlToString(UPDATED_CANDLES),
                variables
            }), handlers),
            onUpdatedTickers: handlers => {
                AbsintheSocket.observe(this.getAbsintheSocket(), AbsintheSocket.send(this.getAbsintheSocket(), {
                    operation: gqlToString(UPDATED_TICKERS),
                    variables: {}
                }), handlers);
            },
            onNewTrades: (variables, handlers) => {
                AbsintheSocket.observe(this.getAbsintheSocket(), AbsintheSocket.send(this.getAbsintheSocket(), {
                    operation: gqlToString(NEW_TRADES),
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
                    operation: gqlToString(NEW_ACCOUNT_TRADES),
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
        this.mode = ClientMode.MPC;
        this.authorization = `Token ${apiKey}`;
        this.wsToken = apiKey;
        this.apiKey = JSON.parse(Buffer.from(secret, 'base64').toString('utf-8'));
        this._headers = {
            'Content-Type': 'application/json',
            Authorization: this.authorization
        };
        this.disconnect();
        this.marketData = await this.fetchMarketData();
        this.nashProtocolMarketData = mapMarketsForNashProtocol(this.marketData);
        this.assetData = await this.fetchAssetData();
        this.pallierPkStr = JSON.stringify(this.apiKey.paillier_pk);
        this.currentOrderNonce = createTimestamp32();
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
        const keys = await getHKDFKeysFromPassword(password, salt);
        const resp = await this.gql.mutate({
            mutation: SIGN_IN_MUTATION,
            variables: {
                email,
                password: keys.authKey.toString('hex')
            }
        });
        this.mode = ClientMode.FULL_SECRET;
        const cookies = setCookie.parse(setCookie.splitCookiesString(resp.headers.get('set-cookie')));
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
        this.currentOrderNonce = createTimestamp32();
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
            encryptedSecretKey: bufferize(this.account.encryptedSecretKey),
            nonce: bufferize(this.account.encryptedSecretKeyNonce),
            tag: bufferize(this.account.encryptedSecretKeyTag)
        };
        this.initParams = {
            walletIndices: this.walletIndices,
            encryptionKey: keys.encryptionKey,
            aead,
            marketData: mapMarketsForNashProtocol(this.marketData),
            assetData: this.assetData
        };
        this.nashCoreConfig = await initialize(this.initParams);
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
            mutation: USER_2FA_LOGIN_MUTATION,
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
        const secretKey = getSecretKey();
        const res = encryptSecretKey(encryptionKey, secretKey);
        this.account.encryptedSecretKey = res.encryptedSecretKey.toString('hex');
        this.account.encryptedSecretKeyTag = res.tag.toString('hex');
        this.account.encryptedSecretKeyNonce = res.nonce.toString('hex');
        const aead = {
            encryptedSecretKey: bufferize(this.account.encryptedSecretKey),
            nonce: bufferize(this.account.encryptedSecretKeyNonce),
            tag: bufferize(this.account.encryptedSecretKeyTag)
        };
        this.initParams = {
            walletIndices: this.walletIndices,
            encryptionKey,
            aead,
            marketData: mapMarketsForNashProtocol(this.marketData),
            assetData: this.assetData
        };
        this.nashCoreConfig = await initialize(this.initParams);
        if (presetWallets !== undefined) {
            const cloned = { ...this.nashCoreConfig };
            cloned.wallets = presetWallets;
            this.nashCoreConfig = cloned;
        }
        this.publicKey = this.nashCoreConfig.payloadSigningKey.publicKey;
        await this.gql.mutate({
            mutation: ADD_KEYS_WITH_WALLETS_MUTATION,
            variables: {
                encryptedSecretKey: toHex(this.initParams.aead.encryptedSecretKey),
                encryptedSecretKeyNonce: toHex(this.initParams.aead.nonce),
                encryptedSecretKeyTag: toHex(this.initParams.aead.tag),
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
        checkMandatoryParams({ marketName, Type: 'string' });
        const result = await this.gql.query({
            query: GET_TICKER,
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
        checkMandatoryParams({ marketName, Type: 'string' });
        const result = await this.gql.query({
            query: GET_ORDERBOOK,
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
        checkMandatoryParams({ marketName, Type: 'string' });
        const result = await this.gql.query({
            query: LIST_TRADES,
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
            query: LIST_TICKERS
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
            query: LIST_ASSETS_QUERY
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
            query: GET_ACCOUNT_VOLUMES,
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
        checkMandatoryParams({ marketName, Type: 'string' });
        const result = await this.gql.query({
            query: LIST_CANDLES,
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
            query: LIST_MARKETS_QUERY
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
        checkMandatoryParams({ marketName, Type: 'string' });
        const result = await this.gql.query({
            query: GET_MARKET_QUERY,
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
            ? LIST_ACCOUNT_ORDERS_WITH_TRADES
            : LIST_ACCOUNT_ORDERS;
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
            query: LIST_ACCOUNT_TRADES,
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
            query: LIST_ACCOUNT_TRANSACTIONS,
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
            query: LIST_ACCOUNT_BALANCES,
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
        checkMandatoryParams({ currency, Type: 'string' });
        const result = await this.gql.query({
            query: GET_ACCOUNT_ADDRESS,
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
            query: GET_ACCOUNT_PORTFOLIO,
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
                timestamp: createTimestamp()
            },
            kind: SigningPayloadID.getMovementPayload
        };
        const signedPayload = await this.signPayload(getMovemementParams);
        const result = await this.gql.query({
            query: GET_MOVEMENT,
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
        checkMandatoryParams({ currency, Type: 'string' });
        const result = await this.gql.query({
            query: GET_ACCOUNT_BALANCE,
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
        checkMandatoryParams({ orderId, Type: 'string' });
        const result = await this.gql.query({
            query: GET_ACCOUNT_ORDER,
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
        const listMovementParams = createListMovementsParams(currency, status, type);
        const signedPayload = await this.signPayload(listMovementParams);
        const result = await this.gql.query({
            query: LIST_MOVEMENTS,
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
        const getAssetNoncesParams = createGetAssetsNoncesParams(assetList);
        const signedPayload = await this.signPayload(getAssetNoncesParams);
        const result = await this.gql.query({
            query: GET_ASSETS_NONCES_QUERY,
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
        if (depth > MAX_SIGN_STATE_RECURSION) {
            throw new Error('Max sign state recursion reached.');
        }
        const signStatesMeasure = this.perfClient.start('signStates');
        const signStateListPayload = createSignStatesParams(this.state_map_from_states(getStatesData.states), this.state_map_from_states(getStatesData.recycledOrders));
        const signedStates = await this.signPayload(signStateListPayload);
        try {
            const result = await this.gql.mutate({
                mutation: SIGN_STATES_MUTATION,
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
        const syncStatesParams = createSyncStatesParams(stateList);
        const signedPayload = await this.signPayload(syncStatesParams);
        const result = await this.gql.mutate({
            mutation: SYNC_STATES_MUTATION,
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
        const cancelOrderParams = createCancelOrderParams(orderID, marketName);
        const signedPayload = await this.signPayload(cancelOrderParams);
        const result = await this.gql.mutate({
            mutation: CANCEL_ORDER_MUTATION,
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
            timestamp: createTimestamp()
        };
        if (marketName !== undefined) {
            cancelAllOrderParams = {
                marketName,
                timestamp: createTimestamp()
            };
        }
        const payloadAndKind = {
            kind: SigningPayloadID.cancelAllOrdersPayload,
            payload: cancelAllOrderParams
        };
        const signedPayload = await this.signPayload(payloadAndKind);
        const result = await this.gql.mutate({
            mutation: CANCEL_ALL_ORDERS_MUTATION,
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
        checkMandatoryParams({
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
        const normalizedAmount = normalizeAmountForMarket(amount, this.marketData[marketName]);
        const normalizedLimitPrice = normalizePriceForMarket(limitPrice, this.marketData[marketName]);
        await this.prefillRPoolIfNeededForAssets(limitPrice.currencyA, limitPrice.currencyB);
        const placeLimitOrderParams = createPlaceLimitOrderParams(allowTaker, normalizedAmount, buyOrSell, cancellationPolicy, normalizedLimitPrice, marketName, noncesFrom, noncesTo, nonceOrder, cancelAt);
        const measurementSignPayload = this.perfClient.start('signPayloadLimitOrder_' + marketName);
        const signedPayload = await this.signPayload(placeLimitOrderParams);
        measurementSignPayload.end();
        try {
            const result = await this.gql.mutate({
                mutation: PLACE_LIMIT_ORDER_MUTATION,
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
            if (e.message.includes(MISSING_NONCES)) {
                replaceOrder = true;
                await this.updateTradedAssetNonces();
            }
            else if (e.message.includes(MAX_ORDERS_REACHED)) {
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
        checkMandatoryParams({
            buyOrSell,
            marketName,
            Type: 'string'
        });
        const { nonceOrder, noncesFrom, noncesTo } = this.getNoncesForTrade(marketName, buyOrSell);
        const normalizedAmount = normalizeAmountForMarket(amount, this.marketData[marketName]);
        const [a, b] = marketName.split('_');
        await this.prefillRPoolIfNeededForAssets(a, b);
        const placeMarketOrderParams = createPlaceMarketOrderParams(normalizedAmount, buyOrSell, marketName, noncesFrom, noncesTo, nonceOrder);
        const measurementSignPayload = this.perfClient.start('signPayloadMarketOrder_' + marketName);
        const signedPayload = await this.signPayload(placeMarketOrderParams);
        measurementSignPayload.end();
        try {
            const result = await this.gql.mutate({
                mutation: PLACE_MARKET_ORDER_MUTATION,
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
            if (e.message.includes(MISSING_NONCES)) {
                replaceOrder = true;
                await this.updateTradedAssetNonces();
            }
            else if (e.message.includes(MAX_ORDERS_REACHED)) {
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
        checkMandatoryParams({ allowTaker, Type: 'boolean' }, { buyOrSell, marketName, cancellationPolicy, Type: 'string' }, { cancelAt: 'number' });
        const { nonceOrder, noncesFrom, noncesTo } = this.getNoncesForTrade(marketName, buyOrSell);
        const normalizedAmount = normalizeAmountForMarket(amount, this.marketData[marketName]);
        const normalizedLimitPrice = normalizePriceForMarket(limitPrice, this.marketData[marketName]);
        const normalizedStopPrice = normalizePriceForMarket(stopPrice, this.marketData[marketName]);
        await this.prefillRPoolIfNeededForAssets(limitPrice.currencyA, limitPrice.currencyB);
        const placeStopLimitOrderParams = createPlaceStopLimitOrderParams(allowTaker, normalizedAmount, buyOrSell, cancellationPolicy, normalizedLimitPrice, marketName, normalizedStopPrice, noncesFrom, noncesTo, nonceOrder, cancelAt);
        const measurementSignPayload = this.perfClient.start('signPayloadStopLimitOrder_' + marketName);
        const signedPayload = await this.signPayload(placeStopLimitOrderParams);
        measurementSignPayload.end();
        try {
            const result = await this.gql.mutate({
                mutation: PLACE_STOP_LIMIT_ORDER_MUTATION,
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
            if (e.message.includes(MISSING_NONCES)) {
                replaceOrder = true;
                await this.updateTradedAssetNonces();
            }
            else if (e.message.includes(MAX_ORDERS_REACHED)) {
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
        checkMandatoryParams({ amount, stopPrice, Type: 'object' }, { buyOrSell, marketName, Type: 'string' });
        const { nonceOrder, noncesFrom, noncesTo } = this.getNoncesForTrade(marketName, buyOrSell);
        const normalizedAmount = normalizeAmountForMarket(amount, this.marketData[marketName]);
        const normalizedStopPrice = normalizePriceForMarket(stopPrice, this.marketData[marketName]);
        const [a, b] = marketName.split('_');
        await this.prefillRPoolIfNeededForAssets(a, b);
        const placeStopMarketOrderParams = createPlaceStopMarketOrderParams(normalizedAmount, buyOrSell, marketName, normalizedStopPrice, noncesFrom, noncesTo, nonceOrder);
        const measurementSignPayload = this.perfClient.start('signPayloadStopMarketOrder_' + marketName);
        const signedPayload = await this.signPayload(placeStopMarketOrderParams);
        measurementSignPayload.end();
        try {
            const result = await this.gql.mutate({
                mutation: PLACE_STOP_MARKET_ORDER_MUTATION,
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
            if (e.message.includes(MISSING_NONCES)) {
                replaceOrder = true;
                await this.updateTradedAssetNonces();
            }
            else if (e.message.includes(MAX_ORDERS_REACHED)) {
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
        if (error.message.includes(MISSING_NONCES)) {
            this.updateTradedAssetNonces();
            throw new MissingNonceError(error.message, signedPayload);
        }
        else if (error.message.includes('Insufficient Funds')) {
            throw new InsufficientFundsError(error.message, signedPayload);
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
        const prepareMovementMovementParams = createPrepareMovementParams(address, quantity, type);
        const preparePayload = await this.signPayload(prepareMovementMovementParams);
        const result = await this.gql.mutate({
            mutation: PREPARE_MOVEMENT_MUTATION,
            variables: {
                payload: preparePayload.payload,
                signature: preparePayload.signature
            }
        });
        const movementPayloadParams = createAddMovementParams(address, quantity, type, result.data.prepareMovement.nonce, null, result.data.prepareMovement.recycledOrders, result.data.prepareMovement.transactionElements);
        const signedMovement = await this.signPayload(movementPayloadParams);
        const payload = { ...signedMovement.payload };
        payload.signedTransactionElements =
            signedMovement.signedPayload.signed_transaction_elements;
        payload.resignedOrders = payload.recycled_orders;
        delete payload.digests;
        delete payload.recycled_orders;
        delete payload.blockchainSignatures;
        const addMovementResult = await this.gql.mutate({
            mutation: ADD_MOVEMENT_MUTATION,
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
        if (assetData.symbol === CryptoCurrency.USDC) {
            approvalPower = this.isMainNet ? 6 : 18;
        }
        const erc20Contract = new this.web3.eth.Contract(Erc20ABI, `0x${assetData.hash}`);
        try {
            const res = await erc20Contract.methods
                .allowance(`0x${this.apiKey.child_keys[BIP44.ETH].address}`, this.opts.ethNetworkSettings.contracts.vault.contract)
                .call();
            return new BigNumber(res).div(Math.pow(10, approvalPower));
        }
        catch (e) {
            return new BigNumber(0);
        }
    }
    validateTransactionCost(gasPrice, estimate) {
        const maxCost = new BigNumber(gasPrice).multipliedBy(estimate);
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
                const erc20Contract = await new this.web3.eth.Contract(Erc20ABI, '0x' + asset.hash);
                const approveAbi = erc20Contract.methods
                    .approve(this.opts.ethNetworkSettings.contracts.vault.contract, UNLIMITED_APPROVAL)
                    .encodeABI();
                const ethApproveNonce = await this.web3.eth.getTransactionCount('0x' + childKey.address);
                const nonce = '0x' + ethApproveNonce.toString(16);
                const estimate = await this.web3.eth.estimateGas({
                    from: '0x' + this.apiKey.child_keys[BIP44.ETH].address,
                    nonce: ethApproveNonce,
                    to: '0x' + asset.hash,
                    data: approveAbi
                });
                const gasPrice = await this.web3.eth.getGasPrice();
                this.validateTransactionCost(gasPrice, estimate);
                const approveTx = new EthTransaction({
                    nonce,
                    gasPrice: '0x' + parseInt(gasPrice, 10).toString(16),
                    gasLimit: '0x' + estimate.toString(16),
                    to: '0x' + asset.hash,
                    value: 0,
                    data: approveAbi
                });
                approveTx.getChainId = () => chainId;
                const approveSignature = await this.signEthTransaction(approveTx);
                setEthSignature(approveTx, approveSignature);
                const p = await this.web3.eth.sendSignedTransaction('0x' + approveTx.serialize().toString('hex'));
                return p;
            }
            catch (e) {
                console.info('Error approving tx: ', e.message);
                if (e.message === 'Returned error: replacement transaction underpriced') {
                    // console.log('approve failed, retrying approve in 15 seconds')
                    await sleep(15000);
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
        const bnAmount = new BigNumber(amount);
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
                await sleep(5000);
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
        if (this.opts.host === EnvironmentConfiguration.production.host) {
            const addrBlockchain = detectBlockchain(address);
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
                const value = currency === CryptoCurrency.ETH ? this.web3.utils.toWei(amount) : '0';
                let data = '';
                if (currency !== CryptoCurrency.ETH) {
                    const erc20Contract = new this.web3.eth.Contract(Erc20ABI, `0x${assetData.hash}`);
                    const externalAmount = transferExternalGetAmount(new BigNumber(amount), assetData, this.isMainNet);
                    data = erc20Contract.methods
                        .transfer(prefixWith0xIfNeeded(address), this.web3.utils.numberToHex(externalAmount))
                        .encodeABI();
                }
                const gasPrice = await this.web3.eth.getGasPrice();
                const estimate = await this.web3.eth.estimateGas({
                    from: prefixWith0xIfNeeded(this.apiKey.child_keys[BIP44.ETH].address),
                    nonce: ethAccountNonce,
                    to: prefixWith0xIfNeeded(currency === CryptoCurrency.ETH
                        ? '0x7C291eB2D2Ec9A35dba0e2C395c5928cd7d90e51'
                        : assetData.hash),
                    value,
                    data
                });
                this.validateTransactionCost(gasPrice, estimate);
                const ethTx = new EthTransaction({
                    nonce: '0x' + ethAccountNonce.toString(16),
                    gasPrice: '0x' + parseInt(gasPrice, 10).toString(16),
                    gasLimit: '0x' + estimate.toString(16),
                    to: prefixWith0xIfNeeded(currency !== CryptoCurrency.ETH ? assetData.hash : address),
                    value: '0x' + parseInt(value, 10).toString(16),
                    data: data === '' ? undefined : data
                });
                ethTx.getChainId = () => chainId;
                const ethTxSignature = await this.signEthTransaction(ethTx);
                setEthSignature(ethTx, ethTxSignature);
                const receipt = await this.web3.eth.sendSignedTransaction('0x' + ethTx.serialize().toString('hex'));
                return {
                    txId: receipt.transactionHash,
                    gasUsed: receipt.gasUsed
                };
            case 'neo':
                let transaction;
                const nodes = this.opts.neoNetworkSettings.nodes.reverse();
                const node = await findBestNetworkNode(nodes);
                const rpcClient = new NeonJS.rpc.RPCClient(node);
                const balance = await NeonJS.api.neoscan.getBalance(this.opts.neoScan, childKey.address);
                if (currency === CryptoCurrency.NEO ||
                    currency === CryptoCurrency.GAS) {
                    transaction = NeonJS.default.create
                        .contractTx()
                        .addIntent(currency.toUpperCase(), new u.Fixed8(amount, 10), address);
                }
                else {
                    const sendAmount = parseFloat(amount) * 1e8;
                    const timestamp = new BigNumber(createTimestamp32()).toString(16);
                    transaction = new tx.InvocationTransaction({
                        script: NeonJS.default.create.script({
                            scriptHash: assetData.hash,
                            operation: 'transfer',
                            args: [
                                sc.ContractParam.byteArray(childKey.address, 'address'),
                                sc.ContractParam.byteArray(address, 'address'),
                                sc.ContractParam.integer(sendAmount)
                            ]
                        }),
                        gas: 0
                    })
                        .addAttribute(tx.TxAttrUsage.Script, u.reverseHex(wallet.getScriptHashFromAddress(childKey.address)))
                        .addAttribute(tx.TxAttrUsage.Remark, timestamp);
                }
                transaction.calculate(balance);
                const payload = transaction.serialize(false);
                const signature = await this.signNeoPayload(payload.toLowerCase());
                transaction.addWitness(tx.Witness.fromSignature(signature, childKey.public_key));
                const neoStatus = await rpcClient.sendRawTransaction(transaction.serialize(true));
                if (!neoStatus) {
                    throw new Error('Could not send neo');
                }
                return {
                    txId: transaction.hash
                };
            case 'btc':
                const pubKey = Buffer.from(childKey.public_key, 'hex');
                const externalTransferAmount = new BigNumber(amount).toNumber();
                const { vins } = await this.getAccountAddress(CryptoCurrency.BTC);
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
                const btcGasPrice = await calculateFeeRate();
                const fee = calculateBtcFees(externalTransferAmount, btcGasPrice, utxos);
                const net = networkFromName(this.opts.btcNetworkSettings.name);
                const btcTx = new bitcoin.Psbt({ network: net });
                let utxoInputTotal = fee.times(-1);
                utxos.forEach(utxo => {
                    utxoInputTotal = utxoInputTotal.plus(utxo.value);
                });
                let useAll = false;
                if (utxoInputTotal.toFixed(8) === new BigNumber(amount).toFixed(8)) {
                    useAll = true;
                }
                const transferAmount = Math.round(new BigNumber(amount).times(BTC_SATOSHI_MULTIPLIER).toNumber());
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
                const myScript = Buffer.from(P2shP2wpkhScript(redeem));
                const allUtxo = utxos.map(utxo => ({
                    ...utxo,
                    txId: utxo.txid,
                    value: new BigNumber(utxo.value)
                        .times(BTC_SATOSHI_MULTIPLIER)
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
                    const result = coinSelect(allUtxo, [{ address, value: transferAmount }], btcGasPrice);
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
                    const { hash, sighashType } = getHashAndSighashType(btcTx.data.inputs, i, pubKey, btcTx.__CACHE, [bitcoin.Transaction.SIGHASH_ALL]);
                    const btcPayloadPresig = await computePresig({
                        apiKey: {
                            client_secret_share: childKey.client_secret_share,
                            paillier_pk: this.apiKey.paillier_pk,
                            public_key: childKey.public_key,
                            server_secret_share_encrypted: childKey.server_secret_share_encrypted
                        },
                        blockchain: Blockchain.BTC,
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
                    blockchain: Blockchain.BTC
                });
                return {
                    txId: btcTxResult
                };
            default:
                throw new Error('Unsupported blockchain ' + assetData.blockchain);
        }
    }
    async signNeoPayload(payload) {
        const messageHash = u.sha256(payload);
        const childKey = this.apiKey.child_keys[BIP44.NEO];
        const payloadPresig = await computePresig({
            apiKey: {
                client_secret_share: childKey.client_secret_share,
                paillier_pk: this.apiKey.paillier_pk,
                public_key: childKey.public_key,
                server_secret_share_encrypted: childKey.server_secret_share_encrypted
            },
            blockchain: Blockchain.NEO,
            fillPoolFn: this.fillPoolFn,
            messageHash
        });
        const signature = await this.completePayloadSignature({
            blockchain: Blockchain.NEO,
            payload,
            public_key: childKey.public_key,
            signature: payloadPresig.presig,
            type: CompletePayloadSignatureType.Blockchain,
            r: payloadPresig.r
        });
        if (!wallet.verify(payload, signature, childKey.public_key)) {
            throw new Error('Completed signature not correct');
        }
        return signature;
    }
    async signEthTransaction(etx) {
        const childKey = this.apiKey.child_keys[BIP44.ETH];
        const txSignature = await computePresig({
            apiKey: {
                client_secret_share: childKey.client_secret_share,
                paillier_pk: this.apiKey.paillier_pk,
                public_key: childKey.public_key,
                server_secret_share_encrypted: childKey.server_secret_share_encrypted
            },
            blockchain: Blockchain.ETH,
            fillPoolFn: this.fillPoolFn,
            messageHash: etx.hash(false).toString('hex')
        });
        const payload = serializeEthTx(etx);
        const invocationSignature = await this.completePayloadSignature({
            blockchain: Blockchain.ETH,
            payload: payload.toLowerCase(),
            public_key: childKey.public_key,
            signature: txSignature.presig,
            type: CompletePayloadSignatureType.Blockchain,
            r: txSignature.r
        });
        return invocationSignature;
    }
    depositToTradingContract(quantity) {
        return this.transferToTradingContract(quantity, MovementTypeDeposit);
    }
    withdrawFromTradingContract(quantity) {
        return this.transferToTradingContract(quantity, MovementTypeWithdrawal);
    }
    async prepareMovement(payload) {
        const signature = await this.signPayload({
            kind: SigningPayloadID.prepareMovementPayload,
            payload: {
                ...payload,
                timestamp: new Date().getTime()
            }
        });
        const data = await this.gql.mutate({
            mutation: PREPARE_MOVEMENT_MUTATION,
            variables: {
                payload: signature.payload,
                signature: signature.signature
            }
        });
        return data.data.prepareMovement;
    }
    async updateMovement(payload) {
        const signature = await this.signPayload({
            kind: SigningPayloadID.updateMovementPayload,
            payload: {
                ...payload,
                timestamp: new Date().getTime()
            }
        });
        const data = await this.gql.mutate({
            mutation: UPDATE_MOVEMENT_MUTATION,
            variables: {
                payload: signature.payload,
                signature: signature.signature
            }
        });
        return data.data.updateMovement;
    }
    transferToTradingContract(quantity, movementType) {
        const promise = new Promievent((resolve, reject) => this._transferToTradingContract(quantity, movementType, (...args) => promise.emit(...args))
            .then(resolve)
            .catch(reject));
        return promise;
    }
    async isMovementCompleted(movementId) {
        const movement = await this.getMovement(movementId);
        return movement.status === MovementStatus.COMPLETED;
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
        const bnAmount = new BigNumber(quantity.amount);
        let preparedMovement;
        let movementAmount = bnAmount;
        const prepareAMovement = async () => {
            const params = {
                address,
                quantity: {
                    amount: bnAmount.toFormat(8, BigNumber.ROUND_FLOOR, BIG_NUMBER_FORMAT),
                    currency: assetData.symbol
                },
                type: movementType
            };
            preparedMovement = await this.prepareMovement(params);
            movementAmount = bnAmount;
            if (quantity.currency === CryptoCurrency.BTC &&
                movementType === MovementTypeWithdrawal) {
                const withdrawalFee = new BigNumber(preparedMovement.fees.amount);
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
                        amount: movementAmount.toFormat(8, BigNumber.ROUND_FLOOR, BIG_NUMBER_FORMAT),
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
                kind: SigningPayloadID.addMovementPayload
            });
            const sanitizedPayload = sanitizeAddMovementPayload(signedAddMovementPayload.signedPayload);
            try {
                addMovementResult = await this.gql.mutate({
                    mutation: ADD_MOVEMENT_MUTATION,
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
                    case BlockchainError.PREPARE_MOVEMENT_MUST_BE_CALLED_FIRST:
                    case BlockchainError.BAD_NONCE:
                        // console.log('preparing movement again')
                        await sleep(15000);
                        await prepareAMovement();
                        break;
                    default:
                        throw e;
                }
            }
        }
        if (quantity.currency === CryptoCurrency.BTC) {
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
            type: CompletePayloadSignatureType.Movement,
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
            status: MovementStatus.PENDING
        })).filter(movement => {
            return (this.assetData[movement.currency] != null &&
                this.assetData[movement.currency].blockchain === chain);
        });
    }
    resumeTradingContractTransaction(unfinishedTransaction) {
        let resolve;
        let reject;
        const out = new Promievent((a, b) => {
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
                type: CompletePayloadSignatureType.Movement,
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
        const bnAmount = new BigNumber(quantity.amount);
        const assetData = this.assetData[movement.currency];
        const blockchain = assetData.blockchain;
        const childKey = this.apiKey.child_keys[BLOCKCHAIN_TO_BIP44[blockchain.toUpperCase()]];
        switch (blockchain) {
            case 'eth':
                if (blockchain === TSAPIBlockchain.ETH &&
                    movementType === MovementTypeDeposit &&
                    quantity.currency !== CryptoCurrency.ETH) {
                    console.log('approving erc20');
                    await this.approveAndAwaitAllowance(assetData, childKey, quantity.amount);
                }
                const { address: scriptAddress, asset, amount: scriptAmount, nonce } = signedAddMovementPayload.blockchain_data;
                const chainId = await this.web3.eth.net.getId();
                const scriptAmountDecimal = parseInt(scriptAmount, 10);
                const amountHex = scriptAmountDecimal.toString(16);
                let value = '0';
                if (quantity.currency === CryptoCurrency.ETH &&
                    movementType === MovementTypeDeposit) {
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
                const invocation = movementType === MovementTypeDeposit
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
                const movementTx = new EthTransaction({
                    nonce: '0x' + ethAccountNonce.toString(16),
                    gasPrice: '0x' + parseInt(gasPrice, 10).toString(16),
                    gasLimit: '0x' + (estimate * 2).toString(16),
                    to: this.opts.ethNetworkSettings.contracts.vault.contract,
                    value: '0x' + parseInt(value, 10).toString(16),
                    data: abi
                });
                movementTx.getChainId = () => chainId;
                const invocationSignature = await this.signEthTransaction(movementTx);
                setEthSignature(movementTx, invocationSignature);
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
                    status: MovementStatus.PENDING,
                    transactionHash: hash.toLowerCase(),
                    transactionPayload: serializedEthTx.toLowerCase(),
                    fee: (parseInt(gasPrice, 10) * estimate * 2).toString()
                });
                return {
                    txId: prefixWith0xIfNeeded(hash)
                };
            case 'neo':
                const timestamp = new BigNumber(createTimestamp32()).toString(16);
                const balance = await NeonJS.api.neoscan.getBalance(this.opts.neoScan, childKey.address);
                const builder = new sc.ScriptBuilder();
                builder.emitAppCall(this.opts.neoNetworkSettings.contracts.vault.contract, movementType === MovementTypeDeposit ? 'deposit' : 'sharedWithdrawal', [
                    new sc.ContractParam('ByteArray', signedAddMovementPayload.blockchain_data.prefix),
                    new sc.ContractParam('ByteArray', signedAddMovementPayload.blockchain_data.address),
                    new sc.ContractParam('ByteArray', signedAddMovementPayload.blockchain_data.asset),
                    new sc.ContractParam('ByteArray', signedAddMovementPayload.blockchain_data.amount),
                    new sc.ContractParam('ByteArray', signedAddMovementPayload.blockchain_data.nonce),
                    new sc.ContractParam('ByteArray', signedAddMovementPayload.blockchain_data.userPubKey),
                    new sc.ContractParam('ByteArray', movement.publicKey),
                    new sc.ContractParam('ByteArray', blockchainSignature),
                    new sc.ContractParam('ByteArray', movement.signature)
                ]);
                let sendingFromSmartContract = false;
                const neoTransaction = new tx.InvocationTransaction({
                    script: builder.str,
                    gas: 0
                }).addAttribute(tx.TxAttrUsage.Script, u.reverseHex(wallet.getScriptHashFromAddress(childKey.address)));
                if (movementType === MovementTypeWithdrawal &&
                    NEP5_OLD_ASSETS.includes(quantity.currency)) {
                    sendingFromSmartContract = true;
                    neoTransaction.addAttribute(tx.TxAttrUsage.Script, u.reverseHex(this.opts.neoNetworkSettings.contracts.vault.contract));
                }
                if (movementType === MovementTypeDeposit &&
                    (quantity.currency === CryptoCurrency.NEO ||
                        quantity.currency === CryptoCurrency.GAS)) {
                    neoTransaction.addIntent(quantity.currency.toUpperCase(), bnAmount.toNumber(), this.opts.neoNetworkSettings.contracts.vault.address);
                }
                neoTransaction
                    .addAttribute(tx.TxAttrUsage.Remark, timestamp)
                    .calculate(balance);
                const payload = neoTransaction.serialize(false);
                const signature = await this.signNeoPayload(payload.toLowerCase());
                neoTransaction.addWitness(tx.Witness.fromSignature(signature, childKey.public_key));
                if (sendingFromSmartContract) {
                    const acct = new wallet.Account(childKey.address);
                    if (parseInt(this.opts.neoNetworkSettings.contracts.vault.contract, 16) > parseInt(acct.scriptHash, 16)) {
                        neoTransaction.scripts.push(new tx.Witness({
                            invocationScript: '0000',
                            verificationScript: ''
                        }));
                    }
                    else {
                        neoTransaction.scripts.unshift(new tx.Witness({
                            invocationScript: '0000',
                            verificationScript: ''
                        }));
                    }
                }
                const signedNeoPayload = neoTransaction.serialize(true);
                await this.updateMovement({
                    movementId: movement.id,
                    status: MovementStatus.PENDING,
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
        const signMovementParams = createAddMovementParams(address, quantity, MovementTypeWithdrawal, nonce);
        const signedPayload = await this.signPayload(signMovementParams);
        const result = await this.gql.mutate({
            mutation: ADD_MOVEMENT_MUTATION,
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
            case ClientMode.NONE:
                throw new Error('Not logged in');
            case ClientMode.FULL_SECRET:
                return this.signPayloadFull(payloadAndKind);
            case ClientMode.MPC:
                return this.signPayloadMpc(payloadAndKind);
        }
    }
    async signPayloadMpc(payloadAndKind) {
        const m = this.perfClient.start('signPayloadMpc');
        this.requireMPC();
        const signedPayload = await preSignPayload(this.apiKey, payloadAndKind, {
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
        const signedPayload = signPayload(privateKey, payloadAndKind, this.nashCoreConfig);
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
            if (direction === OrderBuyOrSell.SELL) {
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
            mutation: COMPLETE_BTC_TRANSACTION_SIGNATURES,
            variables: params
        });
        return resp.data.completeBtcPayloadSignature;
    }
    async sendBlockchainRawTransaction(params) {
        const signedPayload = await this.signPayload(createSendBlockchainRawTransactionParams(params.blockchain, params.payload));
        const resp = await this.gql.mutate({
            mutation: SEND_BLOCKCHAIN_RAW_TRANSACTION,
            variables: {
                payload: signedPayload.payload,
                signature: signedPayload.signature
            }
        });
        return resp.data.sendBlockchainRawTransaction;
    }
    async completePayloadSignature(params) {
        const resp = await this.gql.mutate({
            mutation: COMPLETE_PAYLOAD_SIGNATURE,
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
        return this.apiKey.child_keys[BIP44.NEO].address;
    }
    getEthAddress() {
        return prefixWith0xIfNeeded(this.apiKey.child_keys[BIP44.ETH].address);
    }
    getBtcAddress() {
        return this.apiKey.child_keys[BIP44.BTC].address;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudC9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLGNBQWMsTUFBTSxrQkFBa0IsQ0FBQTtBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFDckQsT0FBTyxTQUFTLE1BQU0sbUJBQW1CLENBQUE7QUFDekMsT0FBTyxLQUFLLE1BQU0sWUFBWSxDQUFBO0FBQzlCLE9BQU8sS0FBSyxNQUFNLHFCQUFxQixDQUFBO0FBQ3ZDLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQTtBQUN6QixPQUFPLElBQUksTUFBTSxNQUFNLENBQUE7QUFDdkIsT0FBTyxLQUFLLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQTtBQUM3QyxPQUFPLFVBQVUsTUFBTSxZQUFZLENBQUE7QUFDbkMsT0FBTyxLQUFLLE9BQU8sTUFBTSxlQUFlLENBQUE7QUFDeEMsT0FBTyxVQUFVLE1BQU0sWUFBWSxDQUFBO0FBQ25DLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQTtBQUV6RCxPQUFPLEVBQUUsV0FBVyxJQUFJLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUM3RCxPQUFPLElBQUksTUFBTSxNQUFNLENBQUE7QUFFdkIsT0FBTyxTQUFTLE1BQU0sY0FBYyxDQUFBO0FBQ3BDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFDM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sK0JBQStCLENBQUE7QUFDbEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNkJBQTZCLENBQUE7QUFDOUQsT0FBTyxFQUNMLHlCQUF5QixFQUUxQixNQUFNLDRDQUE0QyxDQUFBO0FBQ25ELE9BQU8sRUFDTCxtQkFBbUIsRUFDbkIsK0JBQStCLEVBRWhDLE1BQU0s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