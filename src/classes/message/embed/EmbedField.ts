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

    /**
     * The name of the field.
     */
    name: string = null!;
    /**
     * The value of the field.
     */
    value: string = null!;
    /**
     * Whether or not this field is inline.
     */
    inline: boolean = false;

    /**
     * An EmbedField stores data on a field of a
     * MessageEmbed.
     * 
     * @param {string} name The name of the field.
     * @param {string} value The value of the field.
     * @param {boolean} [inline=false] Whether or not this field is inline.
     */
    constructor (name: string, value: string, inline?: boolean) {
        super();
        this.name = name;
        this.value = value;
        this.inline = inline ?? false;
    }

    /**
     * Set the name of the field.
     * 
     * @param {string} name The name of the field.
     * @returns {EmbedField} The updated EmbedField.
     */
    setName (name: string): EmbedField {
        this.name = name;
        return this;
    }

    /**
     * Set the value of the field.
     * 
     * @param {string} value The value of the field.
     * @returns {EmbedField} The updated EmbedField.
     */
    setValue (value: string): EmbedField {
        this.value = value;
        return this;
    }

    /**
     * Set whether or not this field is inline.
     * 
     * @param {boolean} inline Whether or not this field is inline.
     * @returns {EmbedField} The updated EmbedField.
     */
    setInline (inline: boolean): EmbedField {
        this.inline = inline;
        return this;
    }

    /**
     * Format this class into an API-acceptable object.
     * 
     * @returns {any} The formatted object.
     */
    format (): any {
        return {
            name: this.name,
            value: this.value,
            inline: this.inline
        };
    }

}
