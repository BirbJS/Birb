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
    Erlpack = require('erlpack');
} catch {
    Erlpack = null;
}

try {
    Zlib = require('zlib-sync');
} catch {
    Zlib = null;
}

export default class InternalWebsocket {

    /**
     * The client that owns this websocket.
     */
    client: Client = null!;
    /**
     * The websocket's currently set URL.
     */
    url: URL = null!;
    /**
     * The current Discord gateway URL.
     */
    domain: string = null!;
    /**
     * The current status of the websocket.
     */
    status: Status = Status.IDLE;
    /**
     * The type of encoding to use. If `erlpack` is
     * installed (`npm install erlpack`), `etf` encoding
     * will be used. Otherwise, normal `json` encoding will
     * be used.
     */
    encoding: string = Erlpack ? 'etf' : 'json';
    /**
     * The internal erlpack buffer.
     */
    protected buffer: any = null!;

    /**
     * The InternalWebsocket class is a class that handles
     * the annoying stuff regarding websockets connected to
     * Discord (like compression and packing).
     * 
     * @param {Client} client The client that owns this websocket.
     * @param {string} domain The current Discord gateway URL.
     */
    constructor (client: Client, domain: string) {
        this.client = client;
        this.domain = domain;
        this.url = this.generateURL();
    }

    /**
     * Attempts to process a packet by using ZLib to let
     * Discord send packets in chunks. If ZLib is not yet
     * installed (`npm install zlib-sync`), this method
     * will just pass the data through for unpacking
     * (`this.unpack()`).
     * 
     * @param {any} data The packet's data.
     * @returns {any} Hopefully, the packet's JSON form.
     */
    protected processPacket (data: any): any {
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
        } else raw = data;

        try {
            data = this.unpack(raw);
        } catch (e) {
            console.error(e);
            throw new WebsocketProcessingError('failed to unpack packet; more information is likely above');
        }

        return data;
    }

    /**
     * Unpacks a packet using the current encoding. If the
     * encoding is set to `etf`, this method will use the
     * `zlib-sync` (`npm install zlib-sync`) library to
     * unpack its `etf` data. Otherwise, parses the data to
     * normal JSON.
     * 
     * @param {any} data The packet's data.
     * @param {string} [type] The packet's encoding.
     * @returns {any} Hopefully, the packet's JSON form.
     */
    protected unpack (data: any, type?: string): any {
        if (this.encoding === 'json' || type === 'json') {
            if (typeof data !== 'string') {
                data = (new TextDecoder()).decode(data);
            }
            return JSON.parse(data);
        }
        if (!Buffer.isBuffer(data)) {
            data = Buffer.from(new Uint8Array(data));
        }
        return Erlpack!.unpack(data);
    }

    /**
     * Packs data for sending to Discord. If the encoding
     * is set to `etf`, this method will use the
     * `zlib-sync` (`npm install zlib-sync`) library to
     * pack its `etf` data. Otherwise, parses the JSON data
     * to a string.
     * 
     * @param {any} data The data to pack.
     * @returns {any} Hopefully, the data's packed form.
     */
    protected pack (data: any): any {
        if (Erlpack) return Erlpack.pack(data);
        else return JSON.stringify(data);
    }

    /**
     * Initializes ZLib if supported.
     * 
     * @returns {void} Voids once ZLib is initialized.
     */
    protected init (): void {
        if (Zlib) 
            this.buffer = new Zlib.Inflate({
                chunkSize: 65535,
                to: this.encoding === 'json' ? 'string' : undefined,
            });
    }

    /**
     * Generates the gateway URL.
     * 
     * @returns {URL} The gateway URL.
     */
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
