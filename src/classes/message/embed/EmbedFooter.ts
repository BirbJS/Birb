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

    /**
     * The text displayed at the bottom of the embed.
     */
    text: string = null!;
    /**
     * The URL of the icon displayed at the bottom of the
     * embed.
     */
    iconUrl?: string;

    /**
     * An EmbedFooter stores data on the footer field of
     * a MessageEmbed.
     * 
     * @param {string} text The text displayed at the bottom of the embed.
     * @param {string} [iconUrl] A publicly-accessible URL to an image to use as the footer's icon.
     */
    constructor (text: string, iconUrl?: string) {
        super();
        this.text = text;
        this.iconUrl = iconUrl ?? undefined;
    }

    /**
     * Set the text displayed at the bottom of the embed.
     * 
     * @param {string} text The text displayed at the bottom of the embed.
     * @returns {EmbedFooter} The updated EmbedFooter.
     */
    setText (text: string): EmbedFooter {
        this.text = text;
        return this;
    }

    /**
     * Set the URL of the icon displayed at the bottom of the
     * embed.
     * 
     * @param {string | null} url The URL of the icon. `null` to remove the URL.
     * @returns {EmbedFooter} The updated EmbedFooter.
     */
    setIconUrl (iconUrl: string): EmbedFooter {
        this.iconUrl = iconUrl;
        return this;
    }

    /**
     * Remove the the icon displayed at the bottom of the
     * embed.
     * 
     * @returns {EmbedFooter} The updated EmbedFooter.
     */
    removeIcon (): EmbedFooter {
        this.iconUrl = undefined;
        return this;
    }

    /**
     * Format this class into an API-acceptable object.
     * 
     * @returns {any} The formatted object.
     */
    format (): any {
        return {
            text: this.text,
            icon_url: this.iconUrl
        };
    }

}
