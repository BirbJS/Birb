/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

let Zlib: any;
let Erlpack: any;

import { Status } from '../../constants/Status';
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
    url: string = null!;
    status: Status = Status.IDLE;
    encoding: string = Erlpack ? 'etf' : 'json';
    buffer: any = null!;

    constructor (client: Client, url: string) {
        this.client = client;
        this.url = url;
        this.init();
    }

    processPacket (data: any) {
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

    unpack (data: any, type?: string) {
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

    pack (data: any) {
        if (Erlpack) {
            return Erlpack.pack(data);
        } else {
            return JSON.stringify(data);
        }
    }

    init () {
        if (Zlib) {
            this.buffer = new Zlib.Inflate({
                chunkSize: 65535,
                flush: Zlib.Z_SYNC_FLUSH,
                to: this.encoding === 'json' ? 'string' : '',
            });
        }
    }

}
