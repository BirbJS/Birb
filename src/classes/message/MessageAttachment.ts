/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReadStream, createReadStream } from 'fs';

export default class MessageAttachment {

    stream: ReadStream = null!;
    filename: string | null = null;

    constructor (file: ReadStream | string, filename?: string) {
        if (typeof file === 'string') file = createReadStream(file);
        this.stream = file;
        this.filename = filename ?? null;
    }

    getStream (): ReadStream {
        return this.stream;
    }

}
