/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default class BirbJSError extends Error {

    url: string | null = null;

    constructor (name: string, message: string, url: string) {
        super(message + (url ? `\nHead to: ${url}` : ''));
        this.name = name || 'BirbJSError';
        this.url = url;
    }

    compact (): string {
        return `${this.name}: ${this.message}`;
    }

}
