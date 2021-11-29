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

const { Status } = require('../../utils/Constants');

let Zlib;
let Erlpack;

try {
    Zlib = require('zlib-sync');
} catch (e) {}

try {
    Erlpack = require('erlpack');
    if (!Erlpack.pack) Erlpack = null;
} catch (e) {}

/**
 * Processes and handles websocket data. Really, this
 * should never be used directly: use ClientWebsocket
 * instead. Most of this code is based on Discord.JS's
 * code, as handling encoded data is a pain in the ass and
 * is REALLY easy to get wrong without knowing. Thank you
 * to the Discord.JS team for making it open source and
 * saving me the pain.
 * 
 * @class BaseWebsocket
 * @public
 */
class BaseWebsocket {

    client = null;
    encoding = Erlpack ? 'etf' : 'json';
    pack = Erlpack ? Erlpack.pack : JSON.stringify;
    inflate = null;
    status = Status.IDLE;

    constructor (client, domain, version) {
        this.client = client;
        this.domain = domain;
        this.version = version;

        let params = new URLSearchParams();
        params.set('v', this.version);
        params.set('encoding', this.encoding);

        if (Zlib) {
            params.set('compress', 'zlib-stream');
        }

        this.url = new URL(`wss://${domain}/?${params.toString()}`);

        this.client.debug(`version = ${this.version}`);
        this.client.debug(`encoding = ${this.encoding}`);
        this.client.debug(`compression = ${Zlib ? 'zlib-stream' : 'none'}`);
        this.client.debug(`url = ${this.url}`);
    }

    process (data) {
        let raw;
        if (data instanceof ArrayBuffer) data = new Uint8Array(data);
        if (Zlib) {
            const l = data.length;
            const flush = l >= 4 && data[l - 4] === 0x00 && data[l - 3] === 0x00 && data[l - 2] === 0xff && data[l - 1] === 0xff;
            this.inflate.push(data, flush && Zlib.Z_SYNC_FLUSH);
            if (!flush) return;
            raw = this.inflate.result;
        } else {
            raw = data;
        }

        try {
            data = this.unpack(raw);
        } catch (err) {
            this.client.debug(`error decoding data: ${err.message}`);
            return;
        }

        return data;
    }

    unpack (data, type) {
        if (this.encoding === 'json' || type === 'json') {
            if (typeof data !== 'string') {
                data = ab.decode(data);
            }
            return JSON.parse(data);
        }
        if (!Buffer.isBuffer(data)) data = Buffer.from(new Uint8Array(data));
        return Erlpack.unpack(data);
    }

    init () {
        if (Zlib) {
            this.client.debug(`zlib is supported, initializing it...`);
            this.inflate = new Zlib.Inflate({
                chunkSize: 65535,
                flush: Zlib.Z_SYNC_FLUSH,
                to: this.encoding === 'json' ? 'string' : '',
            });
        } else {
            this.client.debug(`zlib is not supported`);
        }
    }

}

module.exports = BaseWebsocket;
