/// <reference types="node" />
declare enum SOCKET_STATES {
    connecting = 0,
    open = 1,
    closing = 2,
    closed = 3
}
declare type BindingCB = (resp: any, ref?: string, bindingRef?: string) => void;
interface Binding {
    event: string;
    ref: string;
    callback: BindingCB;
}
declare type HookCB = (resp: any) => void;
interface Hook {
    status: string;
    callback: HookCB;
}
declare enum CHANNEL_STATES {
    closed = "closed",
    errored = "errored",
    joined = "joined",
    joining = "joining",
    leaving = "leaving"
}
declare enum CHANNEL_EVENTS {
    close = "phx_close",
    error = "phx_error",
    join = "phx_join",
    reply = "phx_reply",
    leave = "phx_leave"
}
/**
 * Initializes the Push
 * @param {Channel} channel - The Channel
 * @param {string} event - The event, for example `"phx_join"`
 * @param {Object} payload - The payload, for example `{user_id: 123}`
 * @param {number} timeout - The push timeout in milliseconds
 */
declare class Push {
    channel: Channel;
    event: string;
    payload: any;
    receivedResp: any;
    timeoutTimer: NodeJS.Timeout | null;
    sent: boolean;
    recHooks: Array<Hook>;
    timeout: number;
    ref: string;
    refEvent: string;
    constructor(channel: Channel, event: string, payload: any, timeout: number);
    /**
     *
     * @param {number} timeout
     */
    resend(timeout: number): void;
    /**
     *
     */
    send(): void;
    /**
     *
     * @param {*} status
     * @param {*} callback
     */
    receive(status: string, callback: HookCB): this;
    /**
     * @private
     */
    reset(): void;
    /**
     * @private
     */
    matchReceive({ status, response }: {
        status: string;
        response: any;
    }): void;
    /**
     * @private
     */
    cancelRefEvent(): void;
    /**
     * @private
     */
    cancelTimeout(): void;
    /**
     * @private
     */
    startTimeout(): void;
    /**
     * @private
     */
    hasReceived(status: any): boolean;
    /**
     * @private
     */
    trigger(status: any, response: any): void;
}
/**
 *
 * @param {string} topic
 * @param {(Object|function)} params
 * @param {Socket} socket
 */
export declare class Channel {
    topic: string;
    params: any;
    socket: Socket;
    state: CHANNEL_STATES;
    bindingRef: number;
    pushBuffer: Push[];
    bindings: Binding[];
    rejoinTimer: Timer;
    joinPush: Push;
    timeout: number;
    stateChangeRefs: string[];
    joinedOnce: boolean;
    constructor(topic: string, params: any, socket: Socket);
    /**
     * Join the channel
     * @param {integer} timeout
     * @returns {Push}
     */
    join(timeout?: number): Push;
    /**
     * Hook into channel close
     * @param {Function} callback
     */
    onClose(callback: any): void;
    /**
     * Hook into channel errors
     * @param {Function} callback
     */
    onError(callback: any): string;
    /**
     * Subscribes on channel events
     *
     * Subscription returns a ref counter, which can be used later to
     * unsubscribe the exact event listener
     *
     * @example
     * const ref1 = channel.on("event", do_stuff)
     * const ref2 = channel.on("event", do_other_stuff)
     * channel.off("event", ref1)
     * // Since unsubscription, do_stuff won't fire,
     * // while do_other_stuff will keep firing on the "event"
     *
     * @param {string} event
     * @param {Function} callback
     * @returns {integer} ref
     */
    on(event: string, callback: BindingCB): string;
    /**
     * Unsubscribes off of channel events
     *
     * Use the ref returned from a channel.on() to unsubscribe one
     * handler, or pass nothing for the ref to unsubscribe all
     * handlers for the given event.
     *
     * @example
     * // Unsubscribe the do_stuff handler
     * const ref1 = channel.on("event", do_stuff)
     * channel.off("event", ref1)
     *
     * // Unsubscribe all handlers from event
     * channel.off("event")
     *
     * @param {string} event
     * @param {integer} ref
     */
    off(event: string, ref?: string): void;
    /**
     * @private
     */
    canPush(): boolean;
    /**
     * Sends a message `event` to phoenix with the payload `payload`.
     * Phoenix receives this in the `handle_in(event, payload, socket)`
     * function. if phoenix replies or it times out (default 10000ms),
     * then optionally the reply can be received.
     *
     * @example
     * channel.push("event")
     *   .receive("ok", payload => console.log("phoenix replied:", payload))
     *   .receive("error", err => console.log("phoenix errored", err))
     *   .receive("timeout", () => console.log("timed out pushing"))
     * @param {string} event
     * @param {Object} payload
     * @param {number} [timeout]
     * @returns {Push}
     */
    push(event: string, payload: any, timeout?: number): Push;
    /** Leaves the channel
     *
     * Unsubscribes from server events, and
     * instructs channel to terminate on server
     *
     * Triggers onClose() hooks
     *
     * To receive leave acknowledgements, use the `receive`
     * hook to bind to the server ack, ie:
     *
     * @example
     * channel.leave().receive("ok", () => alert("left!") )
     *
     * @param {integer} timeout
     * @returns {Push}
     */
    leave(timeout?: number): Push;
    /**
     * Overridable message hook
     *
     * Receives all events for specialized message handling
     * before dispatching to the channel callbacks.
     *
     * Must return the payload, modified or unmodified
     * @param {string} event
     * @param {Object} payload
     * @param {integer} ref
     * @returns {Object}
     */
    onMessage(_: string, payload: any, __?: string, ___?: string): any;
    /**
     * @private
     */
    isLifecycleEvent(event: CHANNEL_EVENTS): boolean;
    /**
     * @private
     */
    isMember(topic: string, event: CHANNEL_EVENTS, payload: any, joinRef: string): boolean;
    /**
     * @private
     */
    joinRef(): string;
    /**
     * @private
     */
    rejoin(timeout?: number): void;
    /**
     * @private
     */
    trigger(event: string, payload?: any, ref?: string, joinRef?: string): void;
    /**
     * @private
     */
    replyEventName(ref: any): string;
    /**
     * @private
     */
    isClosed(): boolean;
    /**
     * @private
     */
    isErrored(): boolean;
    /**
     * @private
     */
    isJoined(): boolean;
    /**
     * @private
     */
    isJoining(): boolean;
    /**
     * @private
     */
    isLeaving(): boolean;
}
export declare let Serializer: {
    encode(msg: any, callback: (s: string) => void): void;
    decode(rawPayload: string, callback: (a: any) => void): void;
};
/** Initializes the Socket
 *
 *
 * For IE8 support use an ES5-shim (https://github.com/es-shims/es5-shim)
 *
 * @param {string} endPoint - The string WebSocket endpoint, ie, `"ws://example.com/socket"`,
 *                                               `"wss://example.com"`
 *                                               `"/socket"` (inherited host & protocol)
 * @param {Object} [opts] - Optional configuration
 * @param {string} [opts.transport] - The Websocket Transport, for example WebSocket or Phoenix.LongPoll.
 *
 * Defaults to WebSocket with automatic LongPoll fallback.
 * @param {Function} [opts.encode] - The function to encode outgoing messages.
 *
 * Defaults to JSON encoder.
 *
 * @param {Function} [opts.decode] - The function to decode incoming messages.
 *
 * Defaults to JSON:
 *
 * ```javascript
 * (payload, callback) => callback(JSON.parse(payload))
 * ```
 *
 * @param {number} [opts.timeout] - The default timeout in milliseconds to trigger push timeouts.
 *
 * Defaults `DEFAULT_TIMEOUT`
 * @param {number} [opts.heartbeatIntervalMs] - The millisec interval to send a heartbeat message
 * @param {number} [opts.reconnectAfterMs] - The optional function that returns the millsec
 * socket reconnect interval.
 *
 * Defaults to stepped backoff of:
 *
 * ```javascript
 * function(tries){
 *   return [10, 50, 100, 150, 200, 250, 500, 1000, 2000][tries - 1] || 5000
 * }
 * ````
 *
 * @param {number} [opts.rejoinAfterMs] - The optional function that returns the millsec
 * rejoin interval for individual channels.
 *
 * ```javascript
 * function(tries){
 *   return [1000, 2000, 5000][tries - 1] || 10000
 * }
 * ````
 *
 * @param {Function} [opts.logger] - The optional function for specialized logging, ie:
 *
 * ```javascript
 * function(kind, msg, data) {
 *   console.log(`${kind}: ${msg}`, data)
 * }
 * ```
 *
 * @param {number} [opts.longpollerTimeout] - The maximum timeout of a long poll AJAX request.
 *
 * Defaults to 20s (double the server long poll timer).
 *
 * @param {{Object|function)} [opts.params] - The optional params to pass when connecting
 * @param {string} [opts.binaryType] - The binary type to use for binary WebSocket frames.
 *
 * Defaults to "arraybuffer"
 *
 * @param {vsn} [opts.vsn] - The serializer's protocol version to send on connect.
 *
 * Defaults to DEFAULT_VSN.
 */
declare type EncodeFn = (any: any, cb: (a: any) => void) => void;
declare type DecodeFn = (any: any, cb: (a: any) => void) => void;
declare type SequenceFn = (n: number) => number;
interface SocketLike {
    send(p: any): void;
    close(code?: number, reason?: string): void;
    binaryType: string;
    timeout: number;
    skipHeartbeat: boolean;
    onopen: (a: any) => void;
    onerror: (a: any) => void;
    bufferedAmount: number;
    readyState: SOCKET_STATES;
    onmessage: (a: any) => void;
    onclose: (a: any) => void;
}
declare type Logger = (a: string, b?: string, d?: any) => void;
interface SocketOpts {
    transport: (endpoint: string) => SocketLike;
    timeout: number;
    heartbeatIntervalMs: number;
    binaryType: string;
    rejoinAfterMs: SequenceFn;
    reconnectAfterMs: SequenceFn;
    decode: DecodeFn;
    vsn: string;
    encode: EncodeFn;
    params: any;
    longpollerTimeout: number;
    logger: Logger;
    automaticReconnect: boolean;
}
export declare class Socket {
    timeout: number;
    ref: number;
    channels: Channel[];
    sendBuffer: any[];
    stateChangeCallbacks: {
        open: any[];
        close: any[];
        error: any[];
        message: any[];
    };
    transport: any;
    defaultEncoder: EncodeFn;
    encode: EncodeFn;
    defaultDecoder: (any: any, cb: (a: any) => void) => void;
    decode: (any: any, cb: (a: any) => void) => void;
    closeWasClean: boolean;
    unloaded: boolean;
    binaryType: string;
    conn: SocketLike;
    vsn: string;
    heartbeatIntervalMs: number;
    rejoinAfterMs: SequenceFn;
    reconnectAfterMs: SequenceFn;
    logger: Logger;
    endPoint: string;
    longpollerTimeout: number;
    params: any;
    reconnectTimer: Timer;
    heartbeatTimer: NodeJS.Timer | null;
    pendingHeartbeatRef: string;
    automaticReconnect: boolean;
    constructor(endPoint: string, opts?: Partial<SocketOpts>);
    /**
     * Returns the socket protocol
     *
     * @returns {string}
     */
    protocol(): "wss" | "ws";
    /**
     * The fully qualifed socket url
     *
     * @returns {string}
     */
    endPointURL(): string;
    /**
     * Disconnects the socket
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes for valid status codes.
     *
     * @param {Function} callback - Optional callback which is called after socket is disconnected.
     * @param {integer} code - A status code for disconnection (Optional).
     * @param {string} reason - A textual description of the reason to disconnect. (Optional)
     */
    disconnect(callback: () => void, code: number, reason: string): void;
    /**
     *
     * @param {Object} params - The params to send when connecting, for example `{user_id: userToken}`
     *
     * Passing params to connect is deprecated; pass them in the Socket constructor instead:
     * `new Socket("/socket", {params: {user_id: userToken}})`.
     */
    connect(params?: any): void;
    /**
     * Logs the message. Override `this.logger` for specialized logging. noops by default
     * @param {string} kind
     * @param {string} msg
     * @param {Object} data
     */
    log(kind: string, msg: string, data?: any): void;
    /**
     * Returns true if a logger has been set on this socket.
     */
    hasLogger(): boolean;
    /**
     * Registers callbacks for connection open events
     *
     * @example socket.onOpen(function(){ console.info("the socket was opened") })
     *
     * @param {Function} callback
     */
    onOpen(callback: any): string;
    /**
     * Registers callbacks for connection close events
     * @param {Function} callback
     */
    onClose(callback: any): string;
    /**
     * Registers callbacks for connection error events
     *
     * @example socket.onError(function(error){ alert("An error occurred") })
     *
     * @param {Function} callback
     */
    onError(callback: any): string;
    /**
     * Registers callbacks for connection message events
     * @param {Function} callback
     */
    onMessage(callback: any): string;
    /**
     * @private
     */
    onConnOpen(): void;
    /**
     * @private
     */
    resetHeartbeat(): void;
    teardown(callback?: () => void, code?: number, reason?: string): void;
    waitForBufferDone(callback: any, tries?: number): void;
    waitForSocketClosed(callback: any, tries?: number): void;
    onConnClose(event: any): void;
    /**
     * @private
     */
    onConnError(error: any): void;
    /**
     * @private
     */
    triggerChanError(): void;
    /**
     * @returns {string}
     */
    connectionState(): "closed" | "open" | "closing" | "connecting";
    /**
     * @returns {boolean}
     */
    isConnected(): boolean;
    /**
     * @private
     *
     * @param {Channel}
     */
    remove(channel: any): void;
    /**
     * Removes `onOpen`, `onClose`, `onError,` and `onMessage` registrations.
     *
     * @param {refs} - list of refs returned by calls to
     *                 `onOpen`, `onClose`, `onError,` and `onMessage`
     */
    off(refs: any): void;
    /**
     * Initiates a new channel for the given topic
     *
     * @param {string} topic
     * @param {Object} chanParams - Parameters for the channel
     * @returns {Channel}
     */
    channel(topic: any, chanParams?: {}): Channel;
    /**
     * @param {Object} data
     */
    push(data: any): void;
    /**
     * Return the next message ref, accounting for overflows
     * @returns {string}
     */
    makeRef(): string;
    sendHeartbeat(): void;
    abnormalClose(reason: any): void;
    flushSendBuffer(): void;
    onConnMessage(rawMessage: any): void;
    leaveOpenTopic(topic: any): void;
}
/**
 *
 * Creates a timer that accepts a `timerCalc` function to perform
 * calculated timeout retries, such as exponential backoff.
 *
 * @example
 * let reconnectTimer = new Timer(() => this.connect(), function(tries){
 *   return [1000, 5000, 10000][tries - 1] || 10000
 * })
 * reconnectTimer.scheduleTimeout() // fires after 1000
 * reconnectTimer.scheduleTimeout() // fires after 5000
 * reconnectTimer.reset()
 * reconnectTimer.scheduleTimeout() // fires after 1000
 *
 * @param {Function} callback
 * @param {Function} timerCalc
 */
declare class Timer {
    timer: NodeJS.Timer;
    tries: number;
    callback: () => void;
    timerCalc: SequenceFn;
    constructor(callback: () => void, timerCalc: SequenceFn);
    reset(): void;
    /**
     * Cancels any previous scheduleTimeout and schedules callback
     */
    scheduleTimeout(): void;
}
export {};
