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
const UnableToResumeWarning = require('../errors/UnableToResumeWarning');

class ClientWebsocket {

    client = null;
    WS = null;
    lastHeartbeat = 0;
    heartbeatInterval = null;
    schedulerLoop = null;
    lastSequenceIdentifier = null;
    sessionIdentifier = null;
    state = "IDLE";
    token = null;

    constructor (client, domain, version, token) {
        this.client = client;
        this.domain = domain;
        this.version = version;
        this.url = new URL(`wss://${domain}/?v=${version}&encoding=json`);
        this.token = token;
        this.scheduler();
    }

    connect () {
        this.state = "CONNECTING";
        this._WS = new WebSocket(this.url);
        this._WS.on('message', this.onReceive.bind(this));
        this._WS.on('open', () => this._WS.ping());
    }

    reconnect () {
        this.state = "RECONNECTING";
        this._WS = new WebSocket(this.url);
        this._WS.on('message', this.onReceive.bind(this));
        this._WS.on('open', () => this._WS.ping());
    }

    close () {
        this.state = "IDLE";
        this._WS.close();
    }

    terminate () {
        this.state = "IDLE";
        this._WS.terminate();
    }

    resume () {
        this.state = "RECONNECTING";
        this.identify();
    }

    heartbeat () {
        this.lastHeartbeat = Date.now();
        this.sendJSON({
            op: 1,
            d: this.lastSequenceIdentifier || null,
        });
    }

    identify () {
        if (this.state === "RECONNECTING") {
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
                compress: false,
            },
        });
    }

    async unableToResume () {
        console.warn(new UnableToResumeWarning());
        await wait(5000);
        this.state = "CONNECTING";
        this.identify();
    }

    sendJSON (data) {
        this._WS.send(JSON.stringify(data));
    }

    onReceive (body) {
        body = JSON.parse(body);
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
                    fn(data);
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
                this.heartbeatInterval = data.heartbeat_interval;
                this.identify();
                break;
            }
            // Discord -> Client: heartbeat acknowledgement
            case 11: {
                // TODO: handle this
                break;
            }
            default: {
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

    setState (state) {
        this.state = state;
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
