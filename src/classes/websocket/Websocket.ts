/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Client from '../Client';
import InternalWebsocket from './InternalWebsocket';
import { WebSocket as WS } from 'ws';
import { GatewayCloseCode, PacketOperation, Status } from '../../util/Constants';
import WebsocketError from '../../errors/WebsocketError';
import ShardingError from '../../errors/ShardingError';

export default class Websocket extends InternalWebsocket {

    ws: WS = null!;
    ping: number = 0;
    expectedGuilds: Set<string> = new Set();
    protected lastHeartbeat = 0;
    protected lastHeartbeatAcked = false;
    protected heartbeatInterval = null;
    protected schedulerLoop: NodeJS.Timer = null!;
    protected lastSequenceIdentifier = null;
    protected sessionIdentifier: string|null = null;
    protected doNotReconnect = false;

    /**
     * Creates a websocket connection to a Discord gateway.
     * 
     * @param {Client} client The client.
     * @param {string} domain The domain to connect to.
     * @public
     */
    constructor (client: Client, domain: string) {
        super(client, domain);
        this.scheduler();
    }

    /**
     * Connect to the gateway.
     * 
     * @returns {void}
     * @public
     */
    connect (): void {
        if (this.status !== Status.IDLE) {
            throw new WebsocketError('cannot create new websocket; already connected; run close() first');
        }
        this.status = Status.CONNECTING;
        this.preventReconnect(false);
        this.init();
        this.ws = new WS(this.url);
        this.ws.on('message', this.onPacket.bind(this));
        this.ws.on('open', () => this.ws.ping());
        this.ws.on('close', this.onClose.bind(this));
    }

    /**
     * Reconnect to the gateway.
     * 
     * @returns {void}
     * @public
     */
    reconnect (): void {
        if (this.status === Status.IDLE) {
            this.connect();
            return;
        }
        if (this.doNotReconnect) {
            throw new WebsocketError('reconnection is not possible; restart the client\'s process');
        }
        if (this.status !== Status.DISCONNECTED) {
            throw new WebsocketError('cannot create new websocket; already connected; run close() first');
        }
        this.status = Status.RECONNECTING;
        this.init();
        this.ws = new WS(this.url);
        this.ws.on('message', this.onPacket.bind(this));
        this.ws.on('open', () => this.onOpen.bind(this));
        this.ws.on('close', this.onClose.bind(this));
    }

    /**
     * Process a packet.
     * 
     * @param {any} data The packet's data.
     * @returns {void}
     * @private
     */
    private onPacket (body: any): void {
        body = this.processPacket(body);
        if (!body) {
            this.client.warn('received invalid gateway packet; ignoring it');
            return;
        }

        if (this.client.options.debug) {
            this.client.debug(`RECV: ${JSON.stringify(body)}`);
        }
        
        let data = body.d || {};

        if (body.s) {
            this.lastSequenceIdentifier = body.s;
        }

        switch (body.op) {
            case PacketOperation.DISPATCH: {
                let event = '';
                let split = body.t.split('');
                let permitted = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';

                for (let i = 0; i < split.length; i++) {
                    if (permitted.includes(split[i])) {
                        event += split[i];
                    }
                }

                try {
                    // why js? well, ts just compiles into js, so the actual
                    // file name is [event].js once compiled into js.
                    let handler = require(`./handlers/${event}.js`);
                    this.client.debug(`DISP: received ${event} event`);
                    // oh and why handler.default()? NO CLUE TS IS WEIRD
                    handler.default(this, data);
                } catch (err) {}

                break;
            }
            case PacketOperation.HELLO: {
                if (this.status !== Status.CONNECTING) {
                    this.client.warn('received hello packet whilst not in connecting state; ignoring it');
                    return;
                }
                this.client.debug('discord hello');
                this.client.debug(`heartbeat interval: ${data.heartbeat_interval}ms`);
                this.heartbeatInterval = data.heartbeat_interval;
                this.lastHeartbeatAcked = true;
                this.lastHeartbeat = Date.now();
                this.ping = 0;
                this.identify();
                break;
            }
            case PacketOperation.HEARTBEAT_ACK: {
                this.client.debug('received heartbeat ack');
                this.lastHeartbeatAcked = true;
                this.ping = Date.now() - this.lastHeartbeat;
                this.client.debug(`ping: ${this.ping}ms`);
                break;
            }
            default: {
                this.client.warn(`received packet with op ${body.op}; ignoring it`);
                break;
            }
        }
    }

    /**
     * Process the websocket opening.
     * 
     * @returns {void}
     * @private
     */
    private onOpen (): void {
        this.client.debug('websocket opened');
        this.ws.ping();
    }

    /**
     * Process the websocket closing.
     * 
     * @param {number} code The closing code.
     * @returns {Promise<void>}
     * @private
     */
    private async onClose (code: number): Promise<void> {
        this.cleanup();
        this.client.debug(`websocket closed with code ${code}`);

        if (!this.isConnected()) {
            // the disconnection was intentional
            return;
        }

        this.status = Status.DISCONNECTED;

        switch (code) {
            case GatewayCloseCode.UNKNOWN_ERROR: {
                this.client.warn('websocket closed due to unknown discord error');
                console.error(new WebsocketError('websocket closed due to an unknown discord error'));
                break;
            }
            case GatewayCloseCode.UNKNOWN_OPCODE:
            case GatewayCloseCode.DECODE_ERROR: {
                this.client.warn('websocket closed due to an unknown opcode or decoding error');
                console.error(new WebsocketError('websocket closed due to an unknown opcode or decoding error; is Birb.JS is up-to-date?'));
                break;
            }
            case GatewayCloseCode.NOT_AUTHENTICATED: {
                this.client.warn('websocket closed due to not being authenticated');
                console.error(new WebsocketError('websocket closed due to not authenticating'));
                break;
            }
            case GatewayCloseCode.AUTHENTICATION_FAILED: {
                this.client.warn('websocket closed due to authentication failure');
                console.error(new WebsocketError('could not authenticate with the gateway; is your token correct?'));
                this.preventReconnect(true);
                break;
            }
            case GatewayCloseCode.ALREADY_AUTHENTICATED: {
                this.client.warn('websocket closed due to already being authenticated');
                console.error(new WebsocketError('sent a second identify packet to the gateway; this should not be happening'));
                break;
            }
            case GatewayCloseCode.INVALID_SEQ:
            case GatewayCloseCode.SESSION_TIMEOUT: {
                this.client.warn('websocket closed due to invalid session');
                console.error(new WebsocketError('websocket closed due to an invalid session'));
                break;
            }
            case GatewayCloseCode.RATE_LIMITED: {
                this.client.warn('websocket closed due to rate limiting');
                console.error(new WebsocketError('you\'ve sent too many requests to the gateway; disconnected'));
                break;
            }
            case GatewayCloseCode.INVALID_SHARD: {
                this.client.warn('websocket closed due to invalid shard');
                console.error(new ShardingError('sharding details are invalid; disconnected from gateway'));
                this.preventReconnect(true);
                break;
            }
            case GatewayCloseCode.SHARDING_REQUIRED: {
                this.client.warn('websocket closed due to sharding being required');
                console.error(new ShardingError('you must shard your Discord bot due to the amount of servers it\'s in\nHead to: https://birb.js.org/explained/sharding'));
                this.preventReconnect(true);
                break;
            }
            case GatewayCloseCode.INVALID_VERSION: {
                this.client.warn('websocket closed due to invalid version');
                console.error(new WebsocketError('the gateway version is invalid; is Birb.JS is up-to-date?'));
                this.preventReconnect(true);
                break;
            }
            case GatewayCloseCode.INVALID_INTENTS: {
                this.client.warn('websocket closed due to invalid intents');
                console.error(new WebsocketError('the intents provided are invalid\nHead to: https://birb.js.org/explained/intents'));
                this.preventReconnect(true);
                break;
            }
            case GatewayCloseCode.DISALLOWED_INTENTS: {
                this.client.warn('websocket closed due to disallowed intents');
                console.error(new WebsocketError('you do not have authorization to use the intents provided\nHead to: https://birb.js.org/explained/intents'));
                this.preventReconnect(true);
                break;
            }
            default: {
                this.client.debug('websocket closed');
                break;
            }
        }

        if (!this.doNotReconnect) {
            await wait(15000);
            this.reconnect();
        } else {
            console.error(new WebsocketError('websocket closed; unable to reconnect'));
        }
    }

    /**
     * Send a packet to the gateway.
     * 
     * @param {Object} data The data to send.
     * @returns {void}
     * @public
     */
    send (data: Object): void {
        this.client.debug(`SEND: ${JSON.stringify(data)}`);

        try {
            data = this.pack(data);
        } catch (err) {
            console.error(err);
            throw new WebsocketError('failed to package packet data');
        }

        if ([Status.IDLE, Status.CONNECTING, Status.RECONNECTING, Status.DISCONNECTED].includes(this.status)) {
            throw new WebsocketError('cannot send packet; websocket is not ready');
        }

        this.ws.send(data);
    }

    /**
     * Send an identify packet to the gateway.
     * 
     * @returns {void}
     * @private
     */
    private identify (): void {
        if (this.status === Status.RESUMING) {
            this.client.debug('sending resume packet...');
            this.send({
                op: PacketOperation.RESUME,
                d: {
                    token: this.client.token,
                    session_id: this.sessionIdentifier,
                    seq: this.lastSequenceIdentifier || null,
                },
            });
            return;
        }
        if (this.status !== Status.CONNECTING) {
            throw new WebsocketError('cannot send identify packet; not in connecting state');
        }

        this.client.debug('sending identify packet...');
        this.status = Status.IDENTIFYING;
        this.send({
            op: PacketOperation.IDENTIFY,
            d: {
                token: this.client.token,
                intents: this.client.options.intents.flags,
                properties: {
                    '$os': process.platform,
                    '$browser': 'birb.js',
                    '$device': 'birb.js',
                },
                compress: true,
            },
        });
    }

    /**
     * Send a heartbeat to the gateway.
     * 
     * @returns {Promise<void>}
     * @public
     */
    async heartbeat (): Promise<void> {
        if (!this.isConnected()) {
            // don't throw an error, it'll cause chaos
            return;
        }
        if (this.lastHeartbeat && !this.lastHeartbeatAcked) {
            this.client.warn('heartbeat not acked (possible timeout?)');
            this.terminate();
            await wait(5000);
            this.reconnect();
        }
        this.client.debug('sending heartbeat...');
        this.lastHeartbeat = Date.now();
        this.send({
            op: PacketOperation.HEARTBEAT,
            d: this.lastSequenceIdentifier || null,
        });
    }

    /**
     * Close the websocket.
     * 
     * @param {number} [code] The close code.
     * @returns {void}
     * @public
     */
    close (code?: number): void {
        if (!this.isConnected()) {
            // don't throw an error, it'll cause chaos
            return;
        }
        this.ws.close(code);
        this.cleanup();
    }

    /**
     * Terminate the websocket. Does not notify the gateway
     * that you've disconnected. Should only be used when
     * the gateway won't respond (e.g. timeouts).
     * 
     * @returns {void}
     * @public
     */
    terminate (): void {
        if (!this.isConnected()) {
            // don't throw an error, it'll cause chaos
            return;
        }
        this.ws.terminate();
        this.cleanup();
    }

    /**
     * Check if the websocket is connected.
     * 
     * @returns {boolean}
     * @public
     */
    isConnected (): boolean {
        return ![Status.IDLE, Status.CONNECTING, Status.RECONNECTING, Status.DISCONNECTED].includes(this.status);
    }

    /**
     * Check if the websocket is closed.
     * 
     * @returns {boolean}
     * @public
     */
    isClosed (): boolean {
        return [Status.IDLE, Status.DISCONNECTED].includes(this.status);
    }

    /**
     * Prevent reconnection.
     * 
     * @param {boolean} [doNotReconnect=true] Whether or not to prevent reconnection.
     * @returns {void}
     * @public
     */
    preventReconnect (value?: boolean): void {
        this.doNotReconnect = value ?? true;
    }

    /**
     * Set the websocket's status.
     * 
     * @param {Status} status The status to set.
     * @returns {void}
     * @public
     */
    setStatus (status: Status): void {
        this.status = status;
    }

    /**
     * Set the websocket's session identifier.
     * 
     * @param {string} sessionIdentifier The session identifier to set.
     * @returns {void}
     * @public
     */
    setSessionIdentifier (sessionIdentifier: string): void {
        this.sessionIdentifier = sessionIdentifier;
    }

    /**
     * Clean up the websocket.
     * 
     * @returns {void}
     * @private
     */
    private cleanup (): void {
        if (this.schedulerLoop) {
            clearInterval(this.schedulerLoop);
        }
        this.ping = 0;
        this.lastHeartbeat = 0;
        this.lastHeartbeatAcked = false;
        this.heartbeatInterval = null;
        this.schedulerLoop = null!;
    }

    /**
     * Creates a loop that will manage repeating tasks. It
     * will call it's method every 50ms.
     * 
     * @returns {void}
     * @private
     */
    private scheduler () {
        if (this.schedulerLoop) {
            clearInterval(this.schedulerLoop);
        }
        this.schedulerLoop = setInterval(() => {
            if (![Status.READY, Status.WAITING_FOR_GUILDS].includes(this.status)) {
                return;
            }
            if (!this.heartbeatInterval || Date.now() >= this.lastHeartbeat + this.heartbeatInterval) {
                this.heartbeat();
            }
        }, 50);
    }

}

async function wait (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
