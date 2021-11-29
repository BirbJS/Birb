/*
    Copyright (C) 2021, knokbak and contributors

    https://github.com/knokbak/Birb

    This Source Code Form is subject to the terms of the
    Mozilla Public License, v. 2.0. If a copy of the MPL
    was not distributed with this file, You can obtain one
    at https://mozilla.org/MPL/2.0/.

    This Source Code Form is “Incompatible With Secondary
    Licenses”, as defined by the Mozilla Public License, v.
    2.0.
*/

const { WebSocket } = require('ws');
const { Status } = require('../../utils/Constants');
const UnableToResumeWarning = require('../errors/UnableToResumeWarning');
const BaseWebsocket = require('./BaseWebsocket');

class ClientWebsocket extends BaseWebsocket {

    WS = null;
    lastHeartbeat = 0;
    lastHeartbeatAcked = false;
    heartbeatInterval = null;
    schedulerLoop = null;
    lastSequenceIdentifier = null;
    sessionIdentifier = null;
    lastGatewayEnsure = null;
    gatewayInfo = null;
    expectedGuilds = null;
    token = null;

    constructor (client, domain, version, token) {
        super(client, domain || 'gateway.discord.gg', version);
        this.token = token;
        this.scheduler();
    }

    async connect () {
        this.status = Status.CONNECTING;
        this.client.debug(`attempting zlib compression init...`);
        this.init();
        this.client.debug(`creating websocket...`);
        this._WS = new WebSocket(this.url);
        this._WS.on('message', this.onReceive.bind(this));
        this._WS.on('open', () => this._WS.ping());
    }

    async reconnect () {
        this.status = Status.RECONNECTING;
        this.client.debug(`attempting zlib compression init...`);
        this.init();
        this.client.debug(`creating websocket...`);
        this._WS = new WebSocket(this.url);
        this._WS.on('message', this.onReceive.bind(this));
        this._WS.on('open', () => this._WS.ping());
    }

    close () {
        this.status = Status.IDLE;
        this._WS.close();
        this.client.debug(`gateway closed`);
    }

    terminate () {
        this.status = Status.IDLE;
        this._WS.terminate();
        this.client.debug(`gateway terminated`);
    }

    resume () {
        this.status = Status.RESUMING;
        this.client.debug(`gateway resuming...`);
        this.identify();
    }

    async heartbeat () {
        if (this.lastHeartbeat && !this.lastHeartbeatAcked) {
            this.client.debug(`heartbeat timeout, terminating connection...`);
            this.lastHeartbeatAcked = true;
            this.terminate();
            await wait(5000);
            this.client.debug(`attempting to reconnect...`);
            this.reconnect();
            return;
        }

        this.client.debug(`sending heartbeat [${this.lastSequenceIdentifier || null}]...`);
        this.lastHeartbeat = Date.now();
        this.lastHeartbeatAcked = false;
        this.sendJSON({
            op: 1,
            d: this.lastSequenceIdentifier || null,
        });
    }

    identify () {
        if ([Status.RECONNECTING, Status.RESUMING].includes(this.status)) {
            this.client.debug(`sending resume packet [${this.sessionIdentifier}]...`);
            this.sendJSON({
                op: 6,
                d: {
                    token: this.token,
                    session_id: this.sessionIdentifier,
                    seq: this.lastSequenceIdentifier || null,
                },
            });
            return;
        }

        this.status = Status.IDENTIFYING;
        this.client.debug(`sending identify packet...`);
        this.sendJSON({
            op: 2,
            d: {
                token: this.token,
                intents: this.client.options.intents.flags,
                properties: {
                    "$os": "node.js",
                    "$browser": "birb",
                    "$device": "birb",
                },
                compress: true,
            },
        });
    }

    async unableToResume () {
        console.warn(new UnableToResumeWarning());
        this.client.debug(`failed to resume - waiting 5 seconds...`);
        await wait(5000);
        this.client.debug(`attempting to identify normally...`);
        this.status = Status.CONNECTING;
        this.identify();
    }

    sendJSON (data) {
        this.client.debug(`SEND: ${JSON.stringify(data)}`);
        data = this.pack(data);
        this._WS.send(data);
    }

    onReceive (body) {
        body = this.process(body);
        //console.log(body);
        let data = body.d || {};

        if (body.s) this.lastSequenceIdentifier = body.s;

        switch (body.op) {
            // Discord -> Client: events
            case 0: {
                let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_".split("");
                let event = body.t.split("");
                let sanitized = "";
        
                for ( let i = 0; i < event.length; i++ ) {
                    if (chars.includes(event[i])) {
                        sanitized += event[i];
                    }
                }
        
                if (sanitized.length === 0) break;
        
                try {
                    let fn = require(`./handlers/${sanitized}.js`);
                    fn(this.client, this, data);
                } catch (e) {}

                break;
            }
            // Discord -> Client: invalid session
            case 9: {
                this.unableToResume();
                break;
            }
            // Discord -> Client: hello (sent immediately after connecting, includes heartbeat info)
            case 10: {
                this.lastHeartbeat = Date.now();
                this.lastHeartbeatAcked = true;
                this.heartbeatInterval = data.heartbeat_interval;
                this.client.debug(`discord hello`);
                this.client.debug(`heartbeat interval: ${this.heartbeatInterval}`);
                this.identify();
                break;
            }
            // Discord -> Client: heartbeat acknowledgement
            case 11: {
                this.client.debug(`discord heartbeat ack`);
                this.client.debug(`RECEIVE: ${JSON.stringify(body)}`);
                this.lastHeartbeatAcked = true;
                break;
            }
            default: {
                this.client.debug(`RECEIVE: ${JSON.stringify(body)}`);
                break;
            }
        }
    }

    scheduler () {
        if (this.schedulerLoop !== null) {
            clearInterval(this.schedulerLoop);
        }
        this.schedulerLoop = setInterval(() => {
            if (this.heartbeatInterval && Date.now() - this.lastHeartbeat > this.heartbeatInterval) {
                this.heartbeat();
            }
        }, 50);
    }

    setStatus (status) {
        this.status = status;
    }

    setExpectedGuilds (guilds) {
        this.expectedGuilds = guilds;
    }

    setSessionIdentifier (sessionIdentifier) {
        this.sessionIdentifier = sessionIdentifier;
    }

}

async function wait (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = ClientWebsocket;
