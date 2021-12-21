/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { readFileSync } from 'fs';

export default class MessageAttachment {

    /**
     * The ID of this attachment. Not present if the
     * attachment is yet to be uploaded to Discord.
     */
    id: string | null = null;
    /**
     * The buffer containing this attachment's data.
     */
    buffer: Buffer | null = null;
    /**
     * The Discord CDN URL to this attachment. Not present
     * if the attachment is yet to be uploaded to Discord.
     */
    url: string | null = null;
    /**
     * The Discord proxy URL to this attachment. Not
     * present if the attachment is yet to be uploaded to
     * Discord.
     */
    proxyUrl: string | null = null;
    /**
     * The filename of this attachment. Can be used to
     * represent this attachment in embededs. For example,
     * if the filename is `image.png`, then the attachment
     * URL would be `attachment://image.png`.
     */
    filename: string = null!;

    /**
     * Creates a new attachment. Does not upload the
     * attachment to Discord.
     * 
     * @param {Buffer | string | null} file The file to upload. If a string, it is assumed to be the path to the file (which Birb.JS shall read and turn into a buffer). Rarely should be set to `null`.
     * @param {string} filename The filename of the attachment. Rarely should be set to `null`.
     * @param {string} [id] The ID of the attachment. Set by Birb.JS internally.
     * @param {string} [url] The Discord CDN URL of the attachment. Set by Birb.JS internally.
     * @param {string} [proxyUrl] The Discord proxy URL of the attachment. Set by Birb.JS internally.
     */
    constructor (file: Buffer | string | null = null, filename: string | null = null, id?: string, url?: string, proxyUrl?: string) {
        let fiddle: Buffer | string | null = file;
        this.filename = filename ?? (typeof fiddle == 'string' ? fiddle.split('/').pop() : null) ?? `unknown-${Date.now()}.attchmnt`;
        if (typeof file === 'string') file = readFileSync(file);
        this.buffer = file;
        this.id = id || null;
        this.url = url || null;
        this.proxyUrl = proxyUrl || null;
    }

    /**
     * Gets the attachment's data as a Buffer.
     * 
     * @returns {Buffer | null} The attachment's data as a Buffer. `null` if the attachment was received from Discord.
     */
    getBuffer (): Buffer | null {
        return this.buffer;
    }

    /**
     * An internal method that creates an array of
     * MessageAttachment objects from an array of raw API
     * attachments. You probably don't need to use this.
     * 
     * @param {attachments[] | null} attachments The raw API attachment data.
     * @returns {MessageAttachment[]} An array of MessageAttachment objects.
     */
    private static fromApiMessage (attachments?: any[] | null): MessageAttachment[] {
        if (!attachments || attachments.length < 1) return [];
        return attachments.map((attach) => 
            new MessageAttachment(null, attach.filename, attach.id, attach.url, attach.proxy_url)
        );
    }

}
