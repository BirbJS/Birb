/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

let Zlib: any;
let Erlpack: any;

import { Status } from '../../util/Constants';
import WebsocketProcessingError from '../../errors/WebsocketProcessingError';
import Client from '../Client';

try {
    Zlib = require('zlib-sync');
} catch (e) {}

try {
    Erlpack = require('erlpack');
    if (!Erlpack.pack) Erlpack = null;
} catch (e) {}

export default class InternalWebsocket {

    client: Client = null!;
    url: URL = null!;
    domain: string = null!;
    status: Status = Status.IDLE;
    encoding: string = Erlpack ? 'etf' : 'json';
    buffer: any = null!;

    constructor (client: Client, domain: string) {
        this.client = client;
        this.domain = domain;
        this.url = this.generateURL();
    }

    protected processPacket (data: any) {
        let raw;
        if (data instanceof ArrayBuffer) {
            data = new Uint8Array(data);
        }

        if (Zlib) {
            let length = data.length;
            let isFull = length >= 4 && data[length - 4] === 0x00 &&
                data[length - 3] === 0x00 && data[length - 2] === 0xff && data[length - 1] === 0xff;
            this.buffer.push(data, isFull && Zlib.Z_SYNC_FLUSH);
            if (!isFull) return;
            raw = this.buffer.result;
        } else {
            raw = data;
        }

        try {
            data = this.unpack(raw);
        } catch (e) {
            console.error(e);
            throw new WebsocketProcessingError('failed to unpack packet; more information is likely above');
        }

        return data;
    }

    protected unpack (data: any, type?: string) {
        if (this.encoding === 'json' || type === 'json') {
            if (typeof data !== 'string') {
                data = (new TextDecoder()).decode(data);
            }
            return JSON.parse(data);
        }
        if (!Buffer.isBuffer(data)) {
            data = Buffer.from(new Uint8Array(data));
        }
        return Erlpack.unpack(data);
    }

    protected pack (data: any) {
        if (Erlpack) {
            return Erlpack.pack(data);
        } else {
            return JSON.stringify(data);
        }
    }

    protected init () {
        if (Zlib) {
            this.buffer = new Zlib.Inflate({
                chunkSize: 65535,
                flush: Zlib.Z_SYNC_FLUSH,
                to: this.encoding === 'json' ? 'string' : '',
            });
        }
    }

    protected generateURL (): URL {
        let params = new URLSearchParams();
        params.set('v', '9');
        params.set('encoding', this.encoding);
        if (Zlib) {
            params.set('compress', 'zlib-stream');
        }
        return new URL(`wss://${this.domain}/?${params.toString()}`);
    }

}
