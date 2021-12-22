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

export default class EmbedFooter extends EmbedChild {

    text: string = null!;
    iconUrl?: string;

    constructor (text: string, iconUrl?: string) {
        super();
        this.text = text;
        this.iconUrl = iconUrl ?? undefined;
    }

    setText (text: string) {
        this.text = text;
    }

    setIconUrl (iconUrl: string) {
        this.iconUrl = iconUrl;
    }

    removeIcon () {
        this.iconUrl = undefined;
    }

    /**
     * Format this class into an API-acceptable object.
     */
    format () {
        return {
            text: this.text,
            icon_url: this.iconUrl
        };
    }

}
