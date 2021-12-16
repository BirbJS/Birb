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

    id: string | null = null;
    buffer: Buffer | null = null;
    url: string | null = null;
    proxyUrl: string | null = null;
    filename: string = null!;

    constructor (file: Buffer | string | null = null, filename: string | null = null, id?: string, url?: string, proxyUrl?: string) {
        let fiddle: Buffer | string | null = file;
        this.filename = filename ?? (typeof fiddle == 'string' ? fiddle.split('/').pop() : null) ?? `unknown-${Date.now()}.attchmnt`;
        if (typeof file === 'string') file = readFileSync(file);
        this.buffer = file;
        this.id = id || null;
        this.url = url || null;
        this.proxyUrl = proxyUrl || null;
    }

    getBuffer (): Buffer | null {
        return this.buffer;
    }

    private static fromApiMessage (attachments?: any[] | null): MessageAttachment[] {
        if (!attachments || attachments.length < 1) return [];
        return attachments.map((attach) => 
            new MessageAttachment(null, attach.filename, attach.id, attach.url, attach.proxy_url)
        );
    }

}
