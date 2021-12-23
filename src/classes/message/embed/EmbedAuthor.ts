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

export default class EmbedAuthor extends EmbedChild {

    /**
     * The name of the author.
     */
    name: string = null!;
    url?: string;
    iconUrl?: string;

    /**
     * An EmbedAuthor stores data on the author field of
     * MessageEmbeds.
     * 
     * @param {string} name The name of the author.
     * @param {string} [url] The URL of the author.
     * @param {string} [iconUrl] A publicly-accessible URL to an image to use as the author's icon.
     */
    constructor (name: string, url?: string, iconUrl?: string) {
        super();
        this.name = name;
        this.url = url;
        this.iconUrl = iconUrl;
    }

    /**
     * Set the name of the author.
     * 
     * @param {string} name The name of the author.
     * @returns {EmbedAuthor} The updated EmbedAuthor.
     */
    setName (name: string): EmbedAuthor {
        this.name = name;
        return this;
    }

    /**
     * Set the URL of the author.
     * 
     * @param {string | undefined} url The URL of the author. Pass through no arguments to remove the URL.
     * @returns {EmbedAuthor} The updated EmbedAuthor.
     */
    setUrl (url?: string): EmbedAuthor {
        this.url = url;
        return this;
    }

    /**
     * Set the icon URL of the author.
     * 
     * @param {string | undefined} iconUrl A publicly-accessible URL to an image to use as the author's icon. Pass through no arguments to remove the icon.
     * @returns {EmbedAuthor} The updated EmbedAuthor.
     */
    setIconUrl (iconUrl?: string): EmbedAuthor {
        this.iconUrl = iconUrl;
        return this;
    }

    /**
     * Remove the author's URL.
     * 
     * @returns {EmbedAuthor} The updated EmbedAuthor.
     */
    removeUrl (): EmbedAuthor {
        this.url = undefined;
        return this;
    }

    /**
     * Remove the author's icon.
     * 
     * @returns {EmbedAuthor} The updated EmbedAuthor.
     */
    removeIcon (): EmbedAuthor {
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
            name: this.name,
            url: this.url,
            icon_url: this.iconUrl
        };
    }

}
