/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import EmbedChild from './EmbedChild';

export default class EmbedMedia extends EmbedChild {

    url: string = null!;
    height?: number = undefined;
    width?: number = undefined;

    constructor (url: string, height?: number, width?: number) {
        super();
        this.url = url;
        this.height = height;
        this.width = width;
    }

    setUrl (url: string) {
        this.url = url;
    }

    setHeight (height: number) {
        this.height = height;
    }

    setWidth (width: number) {
        this.width = width;
    }

    removeHeight () {
        this.height = undefined;
    }

    removeWidth () {
        this.width = undefined;
    }

    /**
     * Format this class into an API-acceptable object.
     */
    format () {
        return {
            url: this.url,
            height: this.height,
            width: this.width
        };
    }

}
