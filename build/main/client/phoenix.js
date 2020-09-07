"use strict";
/* tslint:disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Ported to typescript
 *
 * Everything not needed removed
 */
/**
 * Phoenix Channels JavaScript client
 *
 * ## Socket Connection
 *
 * A single connection is established to the server and
 * channels are multiplexed over the connection.
 * Connect to the server using the `Socket` class:
 *
 * ```javascript
 * let socket = new Socket("/socket", {params: {userToken: "123"}})
 * socket.connect()
 * ```
 *
 * The `Socket` constructor takes the mount point of the socket,
 * the authentication params, as well as options that can be found in
 * the Socket docs, such as configuring the `LongPoll` transport, and
 * heartbeat.
 *
 * ## Channels
 *
 * Channels are isolated, concurrent processes on the server that
 * subscribe to topics and broker events between the client and server.
 * To join a channel, you must provide the topic, and channel params for
 * authorization. Here's an example chat room example where `"new_msg"`
 * events are listened for, messages are pushed to the server, and
 * the channel is joined with ok/error/timeout matches:
 *
 * ```javascript
 * let channel = socket.channel("room:123", {token: roomToken})
 * channel.on("new_msg", msg => console.log("Got message", msg) )
 * $input.onEnter( e => {
 *   channel.push("new_msg", {body: e.target.val}, 10000)
 *     .receive("ok", (msg) => console.log("created message", msg) )
 *     .receive("error", (reasons) => console.log("create failed", reasons) )
 *     .receive("timeout", () => console.log("Networking issue...") )
 * })
 *
 * channel.join()
 *   .receive("ok", ({messages}) => console.log("catching up", messages) )
 *   .receive("error", ({reason}) => console.log("failed join", reason) )
 *   .receive("timeout", () => console.log("Networking issue. Still waiting..."))
 *```
 *
 * ## Joining
 *
 * Creating a channel with `socket.channel(topic, params)`, binds the params to
 * `channel.params`, which are sent up on `channel.join()`.
 * Subsequent rejoins will send up the modified params for
 * updating authorization params, or passing up last_message_id information.
 * Successful joins receive an "ok" status, while unsuccessful joins
 * receive "error".
 *
 * ## Duplicate Join Subscriptions
 *
 * While the client may join any number of topics on any number of channels,
 * the client may only hold a single subscription for each unique topic at any
 * given time. When attempting to create a duplicate subscription,
 * the server will close the existing channel, log a warning, and
 * spawn a new channel for the topic. The client will have their
 * `channel.onClose` callbacks fired for the existing channel, and the new
 * channel join will have its receive hooks processed as normal.
 *
 * ## Pushing Messages
 *
 * From the previous example, we can see that pushing messages to the server
 * can be done with `channel.push(eventName, payload)` and we can optionally
 * receive responses from the push. Additionally, we can use
 * `receive("timeout", callback)` to abort waiting for our other `receive` hooks
 *  and take action after some period of waiting. The default timeout is 10000ms.
 *
 *
 * ## Socket Hooks
 *
 * Lifecycle events of the multiplexed connection can be hooked into via
 * `socket.onError()` and `socket.onClose()` events, ie:
 *
 * ```javascript
 * socket.onError( () => console.log("there was an error with the connection!") )
 * socket.onClose( () => console.log("the connection dropped") )
 * ```
 *
 *
 * ## Channel Hooks
 *
 * For each joined channel, you can bind to `onError` and `onClose` events
 * to monitor the channel lifecycle, ie:
 *
 * ```javascript
 * channel.onError( () => console.log("there was an error!") )
 * channel.onClose( () => console.log("the channel has gone away gracefully") )
 * ```
 *
 * ### onError hooks
 *
 * `onError` hooks are invoked if the socket connection drops, or the channel
 * crashes on the server. In either case, a channel rejoin is attempted
 * automatically in an exponential backoff manner.
 *
 * ### onClose hooks
 *
 * `onClose` hooks are invoked only in two cases. 1) the channel explicitly
 * closed on the server, or 2). The client explicitly closed, by calling
 * `channel.leave()`
 *
 *
 * ## Presence
 *
 * The `Presence` object provides features for syncing presence information
 * from the server with the client and handling presences joining and leaving.
 *
 * ### Syncing state from the server
 *
 * To sync presence state from the server, first instantiate an object and
 * pass your channel in to track lifecycle events:
 *
 * ```javascript
 * let channel = socket.channel("some:topic")
 * let presence = new Presence(channel)
 * ```
 *
 * Next, use the `presence.onSync` callback to react to state changes
 * from the server. For example, to render the list of users every time
 * the list changes, you could write:
 *
 * ```javascript
 * presence.onSync(() => {
 *   myRenderUsersFunction(presence.list())
 * })
 * ```
 *
 * ### Listing Presences
 *
 * `presence.list` is used to return a list of presence information
 * based on the local state of metadata. By default, all presence
 * metadata is returned, but a `listBy` function can be supplied to
 * allow the client to select which metadata to use for a given presence.
 * For example, you may have a user online from different devices with
 * a metadata status of "online", but they have set themselves to "away"
 * on another device. In this case, the app may choose to use the "away"
 * status for what appears on the UI. The example below defines a `listBy`
 * function which prioritizes the first metadata which was registered for
 * each user. This could be the first tab they opened, or the first device
 * they came online from:
 *
 * ```javascript
 * let listBy = (id, {metas: [first, ...rest]}) => {
 *   first.count = rest.length + 1 // count of this user's presences
 *   first.id = id
 *   return first
 * }
 * let onlineUsers = presence.list(listBy)
 * ```
 *
 * ### Handling individual presence join and leave events
 *
 * The `presence.onJoin` and `presence.onLeave` callbacks can be used to
 * react to individual presences joining and leaving the app. For example:
 *
 * ```javascript
 * let presence = new Presence(channel)
 *
 * // detect if user has joined for the 1st time or from another tab/device
 * presence.onJoin((id, current, newPres) => {
 *   if(!current){
 *     console.log("user has entered for the first time", newPres)
 *   } else {
 *     console.log("user additional presence", newPres)
 *   }
 * })
 *
 * // detect if user has left from all tabs/devices, or is still present
 * presence.onLeave((id, current, leftPres) => {
 *   if(current.metas.length === 0){
 *     console.log("user has left from all devices", leftPres)
 *   } else {
 *     console.log("user left from a device", leftPres)
 *   }
 * })
 * // receive presence data from server
 * presence.onSync(() => {
 *   displayUsers(presence.list())
 * })
 * ```
 * @module phoenix
 */
const querystring_1 = __importDefault(require("querystring"));
const WebSocket = require('websocket').w3cwebsocket;
const DEFAULT_VSN = '2.0.0';
var SOCKET_STATES;
(function (SOCKET_STATES) {
    SOCKET_STATES[SOCKET_STATES["connecting"] = 0] = "connecting";
    SOCKET_STATES[SOCKET_STATES["open"] = 1] = "open";
    SOCKET_STATES[SOCKET_STATES["closing"] = 2] = "closing";
    SOCKET_STATES[SOCKET_STATES["closed"] = 3] = "closed";
})(SOCKET_STATES || (SOCKET_STATES = {}));
const DEFAULT_TIMEOUT = 10000;
const WS_CLOSE_NORMAL = 1000;
var CHANNEL_STATES;
(function (CHANNEL_STATES) {
    CHANNEL_STATES["closed"] = "closed";
    CHANNEL_STATES["errored"] = "errored";
    CHANNEL_STATES["joined"] = "joined";
    CHANNEL_STATES["joining"] = "joining";
    CHANNEL_STATES["leaving"] = "leaving";
})(CHANNEL_STATES || (CHANNEL_STATES = {}));
var CHANNEL_EVENTS;
(function (CHANNEL_EVENTS) {
    CHANNEL_EVENTS["close"] = "phx_close";
    CHANNEL_EVENTS["error"] = "phx_error";
    CHANNEL_EVENTS["join"] = "phx_join";
    CHANNEL_EVENTS["reply"] = "phx_reply";
    CHANNEL_EVENTS["leave"] = "phx_leave";
})(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
const CHANNEL_LIFECYCLE_EVENTS = [
    CHANNEL_EVENTS.close,
    CHANNEL_EVENTS.error,
    CHANNEL_EVENTS.join,
    CHANNEL_EVENTS.reply,
    CHANNEL_EVENTS.leave
];
const TRANSPORTS = {
    longpoll: 'longpoll',
    websocket: 'websocket'
};
// wraps value in closure or returns closure
let closure = value => {
    if (typeof value === 'function') {
        return value;
    }
    else {
        let closure = function () {
            return value;
        };
        return closure;
    }
};
/**
 * Initializes the Push
 * @param {Channel} channel - The Channel
 * @param {string} event - The event, for example `"phx_join"`
 * @param {Object} payload - The payload, for example `{user_id: 123}`
 * @param {number} timeout - The push timeout in milliseconds
 */
class Push {
    constructor(channel, event, payload, timeout) {
        this.channel = channel;
        this.event = event;
        this.payload =
            payload ||
                function () {
                    return {};
                };
        this.receivedResp = null;
        this.timeout = timeout;
        this.timeoutTimer = null;
        this.recHooks = [];
        this.sent = false;
    }
    /**
     *
     * @param {number} timeout
     */
    resend(timeout) {
        this.timeout = timeout;
        this.reset();
        this.send();
    }
    /**
     *
     */
    send() {
        if (this.hasReceived('timeout')) {
            return;
        }
        this.startTimeout();
        this.sent = true;
        this.channel.socket.push({
            topic: this.channel.topic,
            event: this.event,
            payload: this.payload(),
            ref: this.ref,
            join_ref: this.channel.joinRef()
        });
    }
    /**
     *
     * @param {*} status
     * @param {*} callback
     */
    receive(status, callback) {
        if (this.hasReceived(status)) {
            callback(this.receivedResp.response);
        }
        this.recHooks.push({ status, callback });
        return this;
    }
    /**
     * @private
     */
    reset() {
        this.cancelRefEvent();
        this.ref = null;
        this.refEvent = null;
        this.receivedResp = null;
        this.sent = false;
    }
    /**
     * @private
     */
    matchReceive({ status, response }) {
        this.recHooks
            .filter(h => h.status === status)
            .forEach(h => h.callback(response));
    }
    /**
     * @private
     */
    cancelRefEvent() {
        if (!this.refEvent) {
            return;
        }
        this.channel.off(this.refEvent);
    }
    /**
     * @private
     */
    cancelTimeout() {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = null;
    }
    /**
     * @private
     */
    startTimeout() {
        if (this.timeoutTimer) {
            this.cancelTimeout();
        }
        this.ref = this.channel.socket.makeRef();
        this.refEvent = this.channel.replyEventName(this.ref);
        this.channel.on(this.refEvent, (payload) => {
            this.cancelRefEvent();
            this.cancelTimeout();
            this.receivedResp = payload;
            this.matchReceive(payload);
        });
        this.timeoutTimer = setTimeout(() => {
            this.trigger('timeout', {});
        }, this.timeout);
    }
    /**
     * @private
     */
    hasReceived(status) {
        return this.receivedResp && this.receivedResp.status === status;
    }
    /**
     * @private
     */
    trigger(status, response) {
        this.channel.trigger(this.refEvent, { status, response });
    }
}
/**
 *
 * @param {string} topic
 * @param {(Object|function)} params
 * @param {Socket} socket
 */
class Channel {
    constructor(topic, params, socket) {
        this.state = CHANNEL_STATES.closed;
        this.topic = topic;
        this.params = closure(params || {});
        this.socket = socket;
        this.bindings = [];
        this.bindingRef = 0;
        this.timeout = this.socket.timeout;
        this.joinedOnce = false;
        this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
        this.pushBuffer = [];
        this.stateChangeRefs = [];
        this.rejoinTimer = new Timer(() => {
            if (this.socket.isConnected()) {
                this.rejoin();
            }
        }, this.socket.rejoinAfterMs);
        this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
        this.stateChangeRefs.push(this.socket.onOpen(() => {
            this.rejoinTimer.reset();
            if (this.isErrored()) {
                this.rejoin();
            }
        }));
        this.joinPush.receive('ok', () => {
            this.state = CHANNEL_STATES.joined;
            this.rejoinTimer.reset();
            this.pushBuffer.forEach(pushEvent => pushEvent.send());
            this.pushBuffer = [];
        });
        this.joinPush.receive('error', () => {
            this.state = CHANNEL_STATES.errored;
            if (this.socket.isConnected()) {
                this.rejoinTimer.scheduleTimeout();
            }
        });
        this.onClose(() => {
            this.rejoinTimer.reset();
            if (this.socket.hasLogger())
                this.socket.log('channel', `close ${this.topic} ${this.joinRef()}`);
            this.state = CHANNEL_STATES.closed;
            this.socket.remove(this);
        });
        this.onError(reason => {
            if (this.socket.hasLogger())
                this.socket.log('channel', `error ${this.topic}`, reason);
            if (this.isJoining()) {
                this.joinPush.reset();
            }
            this.state = CHANNEL_STATES.errored;
            if (this.socket.isConnected()) {
                this.rejoinTimer.scheduleTimeout();
            }
        });
        this.joinPush.receive('timeout', () => {
            if (this.socket.hasLogger())
                this.socket.log('channel', `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
            let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
            leavePush.send();
            this.state = CHANNEL_STATES.errored;
            this.joinPush.reset();
            if (this.socket.isConnected()) {
                this.rejoinTimer.scheduleTimeout();
            }
        });
        this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
            this.trigger(this.replyEventName(ref), payload);
        });
    }
    /**
     * Join the channel
     * @param {integer} timeout
     * @returns {Push}
     */
    join(timeout = this.timeout) {
        if (this.joinedOnce) {
            throw new Error(`tried to join multiple times. 'join' can only be called a single time per channel instance`);
        }
        else {
            this.timeout = timeout;
            this.joinedOnce = true;
            this.rejoin();
            return this.joinPush;
        }
    }
    /**
     * Hook into channel close
     * @param {Function} callback
     */
    onClose(callback) {
        this.on(CHANNEL_EVENTS.close, callback);
    }
    /**
     * Hook into channel errors
     * @param {Function} callback
     */
    onError(callback) {
        return this.on(CHANNEL_EVENTS.error, reason => callback(reason));
    }
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
    on(event, callback) {
        let ref = (this.bindingRef++).toString();
        this.bindings.push({ event, ref, callback });
        return ref;
    }
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
    off(event, ref) {
        this.bindings = this.bindings.filter(bind => {
            return !(bind.event === event &&
                (typeof ref === 'undefined' || ref === bind.ref));
        });
    }
    /**
     * @private
     */
    canPush() {
        return this.socket.isConnected() && this.isJoined();
    }
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
    push(event, payload, timeout = this.timeout) {
        if (!this.joinedOnce) {
            throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
        }
        let pushEvent = new Push(this, event, function () {
            return payload;
        }, timeout);
        if (this.canPush()) {
            pushEvent.send();
        }
        else {
            pushEvent.startTimeout();
            this.pushBuffer.push(pushEvent);
        }
        return pushEvent;
    }
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
    leave(timeout = this.timeout) {
        this.rejoinTimer.reset();
        this.joinPush.cancelTimeout();
        this.state = CHANNEL_STATES.leaving;
        const onClose = () => {
            if (this.socket.hasLogger()) {
                this.socket.log('channel', `leave ${this.topic}`);
            }
            this.trigger(CHANNEL_EVENTS.close, 'leave');
        };
        const leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
        leavePush.receive('ok', () => onClose()).receive('timeout', () => onClose());
        leavePush.send();
        if (!this.canPush()) {
            leavePush.trigger('ok', {});
        }
        return leavePush;
    }
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
    onMessage(_, payload, __, ___) {
        return payload;
    }
    /**
     * @private
     */
    isLifecycleEvent(event) {
        return CHANNEL_LIFECYCLE_EVENTS.indexOf(event) >= 0;
    }
    /**
     * @private
     */
    isMember(topic, event, payload, joinRef) {
        if (this.topic !== topic) {
            return false;
        }
        if (joinRef && joinRef !== this.joinRef() && this.isLifecycleEvent(event)) {
            if (this.socket.hasLogger()) {
                this.socket.log('channel', 'dropping outdated message', {
                    topic,
                    event,
                    payload,
                    joinRef
                });
            }
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * @private
     */
    joinRef() {
        return this.joinPush.ref;
    }
    /**
     * @private
     */
    rejoin(timeout = this.timeout) {
        if (this.isLeaving()) {
            return;
        }
        this.socket.leaveOpenTopic(this.topic);
        this.state = CHANNEL_STATES.joining;
        this.joinPush.resend(timeout);
    }
    /**
     * @private
     */
    trigger(event, payload, ref, joinRef) {
        const handledPayload = this.onMessage(event, payload, ref, joinRef);
        if (payload && !handledPayload) {
            throw new Error('channel onMessage callbacks must return the payload, modified or unmodified');
        }
        const eventBindings = this.bindings.filter(bind => bind.event === event);
        for (let i = 0; i < eventBindings.length; i++) {
            const bind = eventBindings[i];
            bind.callback(handledPayload, ref, joinRef || this.joinRef());
        }
    }
    /**
     * @private
     */
    replyEventName(ref) {
        return `chan_reply_${ref}`;
    }
    /**
     * @private
     */
    isClosed() {
        return this.state === CHANNEL_STATES.closed;
    }
    /**
     * @private
     */
    isErrored() {
        return this.state === CHANNEL_STATES.errored;
    }
    /**
     * @private
     */
    isJoined() {
        return this.state === CHANNEL_STATES.joined;
    }
    /**
     * @private
     */
    isJoining() {
        return this.state === CHANNEL_STATES.joining;
    }
    /**
     * @private
     */
    isLeaving() {
        return this.state === CHANNEL_STATES.leaving;
    }
}
exports.Channel = Channel;
/* The default serializer for encoding and decoding messages */
exports.Serializer = {
    encode(msg, callback) {
        const encoded = JSON.stringify([
            msg.join_ref,
            msg.ref,
            msg.topic,
            msg.event,
            msg.payload
        ]);
        return callback(encoded);
    },
    decode(rawPayload, callback) {
        const [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
        return callback({ join_ref, ref, topic, event, payload });
    }
};
class Socket {
    constructor(endPoint, opts = {}) {
        this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
        this.channels = [];
        this.sendBuffer = [];
        this.ref = 0;
        this.timeout = opts.timeout || DEFAULT_TIMEOUT;
        this.transport = opts.transport || WebSocket;
        this.defaultEncoder = exports.Serializer.encode;
        this.defaultDecoder = exports.Serializer.decode;
        this.closeWasClean = false;
        this.unloaded = false;
        this.binaryType = opts.binaryType || 'arraybuffer';
        this.encode = opts.encode || this.defaultEncoder;
        this.decode = opts.decode || this.defaultDecoder;
        this.automaticReconnect = opts.automaticReconnect || true;
        process.on('exit', () => {
            if (this.conn) {
                this.unloaded = true;
                this.abnormalClose('unloaded');
            }
        });
        this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 30000;
        this.rejoinAfterMs = tries => {
            if (opts.rejoinAfterMs) {
                return opts.rejoinAfterMs(tries);
            }
            else {
                return [1000, 2000, 5000][tries - 1] || 10000;
            }
        };
        this.reconnectAfterMs = tries => {
            if (this.unloaded) {
                return 100;
            }
            if (opts.reconnectAfterMs) {
                return opts.reconnectAfterMs(tries);
            }
            else {
                return [10, 50, 100, 150, 200, 250, 500, 1000, 2000][tries - 1] || 5000;
            }
        };
        this.logger = opts.logger || null;
        this.longpollerTimeout = opts.longpollerTimeout || 20000;
        this.params = closure(opts.params || {});
        this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
        this.vsn = opts.vsn || DEFAULT_VSN;
        this.heartbeatTimer = null;
        this.pendingHeartbeatRef = null;
        this.reconnectTimer = new Timer(() => {
            this.teardown(() => this.connect());
        }, this.reconnectAfterMs);
    }
    /**
     * Returns the socket protocol
     *
     * @returns {string}
     */
    protocol() {
        return location.protocol.match(/^https/) ? 'wss' : 'ws';
    }
    /**
     * The fully qualifed socket url
     *
     * @returns {string}
     */
    endPointURL() {
        const uri = this.endPoint +
            '?' +
            querystring_1.default.encode({
                ...this.params(),
                vsn: this.vsn
            });
        if (uri.charAt(0) !== '/') {
            return uri;
        }
        if (uri.charAt(1) === '/') {
            return `${this.protocol()}:${uri}`;
        }
        return `${this.protocol()}://${location.host}${uri}`;
    }
    /**
     * Disconnects the socket
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes for valid status codes.
     *
     * @param {Function} callback - Optional callback which is called after socket is disconnected.
     * @param {integer} code - A status code for disconnection (Optional).
     * @param {string} reason - A textual description of the reason to disconnect. (Optional)
     */
    disconnect(callback, code, reason) {
        this.closeWasClean = true;
        this.reconnectTimer.reset();
        this.teardown(callback, code, reason);
    }
    /**
     *
     * @param {Object} params - The params to send when connecting, for example `{user_id: userToken}`
     *
     * Passing params to connect is deprecated; pass them in the Socket constructor instead:
     * `new Socket("/socket", {params: {user_id: userToken}})`.
     */
    connect(params) {
        if (params) {
            console &&
                console.log('passing params to connect is deprecated. Instead pass :params to the Socket constructor');
            this.params = closure(params);
        }
        if (this.conn) {
            return;
        }
        this.closeWasClean = false;
        this.conn = new this.transport(this.endPointURL());
        this.conn.binaryType = this.binaryType;
        this.conn.timeout = this.longpollerTimeout;
        this.conn.onopen = () => this.onConnOpen();
        this.conn.onerror = error => this.onConnError(error);
        this.conn.onmessage = event => this.onConnMessage(event);
        this.conn.onclose = event => this.onConnClose(event);
    }
    /**
     * Logs the message. Override `this.logger` for specialized logging. noops by default
     * @param {string} kind
     * @param {string} msg
     * @param {Object} data
     */
    log(kind, msg, data) {
        this.logger(kind, msg, data);
    }
    /**
     * Returns true if a logger has been set on this socket.
     */
    hasLogger() {
        return this.logger !== null;
    }
    /**
     * Registers callbacks for connection open events
     *
     * @example socket.onOpen(function(){ console.info("the socket was opened") })
     *
     * @param {Function} callback
     */
    onOpen(callback) {
        let ref = this.makeRef();
        this.stateChangeCallbacks.open.push([ref, callback]);
        return ref;
    }
    /**
     * Registers callbacks for connection close events
     * @param {Function} callback
     */
    onClose(callback) {
        let ref = this.makeRef();
        this.stateChangeCallbacks.close.push([ref, callback]);
        return ref;
    }
    /**
     * Registers callbacks for connection error events
     *
     * @example socket.onError(function(error){ alert("An error occurred") })
     *
     * @param {Function} callback
     */
    onError(callback) {
        let ref = this.makeRef();
        this.stateChangeCallbacks.error.push([ref, callback]);
        return ref;
    }
    /**
     * Registers callbacks for connection message events
     * @param {Function} callback
     */
    onMessage(callback) {
        let ref = this.makeRef();
        this.stateChangeCallbacks.message.push([ref, callback]);
        return ref;
    }
    /**
     * @private
     */
    onConnOpen() {
        if (this.hasLogger())
            this.log('transport', `connected to ${this.endPointURL()}`);
        this.unloaded = false;
        this.closeWasClean = false;
        this.flushSendBuffer();
        this.reconnectTimer.reset();
        this.resetHeartbeat();
        this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
    }
    /**
     * @private
     */
    resetHeartbeat() {
        if (this.conn && this.conn.skipHeartbeat) {
            return;
        }
        this.pendingHeartbeatRef = null;
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
        if (!this.conn) {
            return callback && callback();
        }
        this.waitForBufferDone(() => {
            if (this.conn) {
                if (code) {
                    this.conn.close(code, reason || '');
                }
                else {
                    this.conn.close();
                }
            }
            this.waitForSocketClosed(() => {
                if (this.conn) {
                    this.conn.onclose = function () { }; // noop
                    this.conn = null;
                }
                callback && callback();
            });
        });
    }
    waitForBufferDone(callback, tries = 1) {
        if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
            callback();
            return;
        }
        setTimeout(() => {
            this.waitForBufferDone(callback, tries + 1);
        }, 150 * tries);
    }
    waitForSocketClosed(callback, tries = 1) {
        if (tries === 5 ||
            !this.conn ||
            this.conn.readyState === SOCKET_STATES.closed) {
            callback();
            return;
        }
        setTimeout(() => {
            this.waitForSocketClosed(callback, tries + 1);
        }, 150 * tries);
    }
    onConnClose(event) {
        if (this.hasLogger())
            this.log('transport', 'close', event);
        this.triggerChanError();
        clearInterval(this.heartbeatTimer);
        if (!this.automaticReconnect) {
            this.disconnect(() => { }, SOCKET_STATES.closed, 'close');
        }
        if (!this.closeWasClean) {
            this.reconnectTimer.scheduleTimeout();
        }
        this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
    }
    /**
     * @private
     */
    onConnError(error) {
        if (this.hasLogger())
            this.log('transport', error);
        this.triggerChanError();
        this.stateChangeCallbacks.error.forEach(([, callback]) => callback(error));
    }
    /**
     * @private
     */
    triggerChanError() {
        this.channels.forEach(channel => {
            if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
                channel.trigger(CHANNEL_EVENTS.error);
            }
        });
    }
    /**
     * @returns {string}
     */
    connectionState() {
        switch (this.conn && this.conn.readyState) {
            case SOCKET_STATES.connecting:
                return 'connecting';
            case SOCKET_STATES.open:
                return 'open';
            case SOCKET_STATES.closing:
                return 'closing';
            default:
                return 'closed';
        }
    }
    /**
     * @returns {boolean}
     */
    isConnected() {
        return this.connectionState() === 'open';
    }
    /**
     * @private
     *
     * @param {Channel}
     */
    remove(channel) {
        this.off(channel.stateChangeRefs);
        this.channels = this.channels.filter(c => c.joinRef() !== channel.joinRef());
    }
    /**
     * Removes `onOpen`, `onClose`, `onError,` and `onMessage` registrations.
     *
     * @param {refs} - list of refs returned by calls to
     *                 `onOpen`, `onClose`, `onError,` and `onMessage`
     */
    off(refs) {
        for (let key in this.stateChangeCallbacks) {
            this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
                return refs.indexOf(ref) === -1;
            });
        }
    }
    /**
     * Initiates a new channel for the given topic
     *
     * @param {string} topic
     * @param {Object} chanParams - Parameters for the channel
     * @returns {Channel}
     */
    channel(topic, chanParams = {}) {
        const chan = new Channel(topic, chanParams, this);
        this.channels.push(chan);
        return chan;
    }
    /**
     * @param {Object} data
     */
    push(data) {
        if (this.hasLogger()) {
            let { topic, event, payload, ref, join_ref } = data;
            this.log('push', `${topic} ${event} (${join_ref}, ${ref})`, payload);
        }
        if (this.isConnected()) {
            this.encode(data, result => this.conn.send(result));
        }
        else {
            this.sendBuffer.push(() => this.encode(data, result => this.conn.send(result)));
        }
    }
    /**
     * Return the next message ref, accounting for overflows
     * @returns {string}
     */
    makeRef() {
        const newRef = this.ref + 1;
        if (newRef === this.ref) {
            this.ref = 0;
        }
        else {
            this.ref = newRef;
        }
        return this.ref.toString();
    }
    sendHeartbeat() {
        if (!this.isConnected()) {
            return;
        }
        if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null;
            if (this.hasLogger())
                this.log('transport', 'heartbeat timeout. Attempting to re-establish connection');
            this.abnormalClose('heartbeat timeout');
            return;
        }
        this.pendingHeartbeatRef = this.makeRef();
        this.push({
            topic: 'phoenix',
            event: 'heartbeat',
            payload: {},
            ref: this.pendingHeartbeatRef
        });
    }
    abnormalClose(reason) {
        this.closeWasClean = false;
        this.conn.close(WS_CLOSE_NORMAL, reason);
    }
    flushSendBuffer() {
        if (this.isConnected() && this.sendBuffer.length > 0) {
            this.sendBuffer.forEach(callback => callback());
            this.sendBuffer = [];
        }
    }
    onConnMessage(rawMessage) {
        this.decode(rawMessage.data, msg => {
            let { topic, event, payload, ref, join_ref } = msg;
            if (ref && ref === this.pendingHeartbeatRef) {
                this.pendingHeartbeatRef = null;
            }
            if (this.hasLogger())
                this.log('receive', `${payload.status || ''} ${topic} ${event} ${(ref &&
                    '(' + ref + ')') ||
                    ''}`, payload);
            for (let i = 0; i < this.channels.length; i++) {
                const channel = this.channels[i];
                if (!channel.isMember(topic, event, payload, join_ref)) {
                    continue;
                }
                channel.trigger(event, payload, ref, join_ref);
            }
            for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
                let [, callback] = this.stateChangeCallbacks.message[i];
                callback(msg);
            }
        });
    }
    leaveOpenTopic(topic) {
        let dupChannel = this.channels.find(c => c.topic === topic && (c.isJoined() || c.isJoining()));
        if (dupChannel) {
            if (this.hasLogger())
                this.log('transport', `leaving duplicate topic "${topic}"`);
            dupChannel.leave();
        }
    }
}
exports.Socket = Socket;
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
class Timer {
    constructor(callback, timerCalc) {
        this.callback = callback;
        this.timerCalc = timerCalc;
        this.timer = null;
        this.tries = 0;
    }
    reset() {
        this.tries = 0;
        clearTimeout(this.timer);
    }
    /**
     * Cancels any previous scheduleTimeout and schedules callback
     */
    scheduleTimeout() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.tries = this.tries + 1;
            this.callback();
        }, this.timerCalc(this.tries + 1));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvZW5peC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnQvcGhvZW5peC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0JBQW9COzs7OztBQUVwQjs7OztHQUlHO0FBRUg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUxHO0FBQ0gsOERBQXFDO0FBQ3JDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxZQUFZLENBQUE7QUFDbkQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFBO0FBQzNCLElBQUssYUFLSjtBQUxELFdBQUssYUFBYTtJQUNoQiw2REFBYyxDQUFBO0lBQ2QsaURBQVEsQ0FBQTtJQUNSLHVEQUFXLENBQUE7SUFDWCxxREFBVSxDQUFBO0FBQ1osQ0FBQyxFQUxJLGFBQWEsS0FBYixhQUFhLFFBS2pCO0FBQ0QsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFBO0FBQzdCLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQTtBQVk1QixJQUFLLGNBTUo7QUFORCxXQUFLLGNBQWM7SUFDakIsbUNBQWlCLENBQUE7SUFDakIscUNBQW1CLENBQUE7SUFDbkIsbUNBQWlCLENBQUE7SUFDakIscUNBQW1CLENBQUE7SUFDbkIscUNBQW1CLENBQUE7QUFDckIsQ0FBQyxFQU5JLGNBQWMsS0FBZCxjQUFjLFFBTWxCO0FBQ0QsSUFBSyxjQU1KO0FBTkQsV0FBSyxjQUFjO0lBQ2pCLHFDQUFtQixDQUFBO0lBQ25CLHFDQUFtQixDQUFBO0lBQ25CLG1DQUFpQixDQUFBO0lBQ2pCLHFDQUFtQixDQUFBO0lBQ25C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