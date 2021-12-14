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

export default class EmbedField extends EmbedChild {

    name: string = null!;
    value: string = null!;
    inline: boolean = false;

    constructor (name: string, value: string, inline?: boolean) {
        super();
        this.name = name;
        this.value = value;
        this.inline = inline ?? false;
    }

    setName (name: string) {
        this.name = name;
    }

    setValue (value: string) {
        this.value = value;
    }

    setInline (inline: boolean) {
        this.inline = inline;
    }

    /**
     * Format this class into an API-acceptable object.
     */
    format () {
        return {
            name: this.name,
            value: this.value,
            inline: this.inline
        };
    }

}
