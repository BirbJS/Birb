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

    /**
     * The URL of the media.
     */
    url: string = null!;
    /**
     * The height of the media.
     */
    height?: number;
    /**
     * The width of the media.
     */
    width?: number;

    /**
     * An EmbedMedia stores data on a media or attachment
     * field of a MessageEmbed.
     * 
     * @param {string} url The URL of the media. If refrences an attachment, prefix with `attachment://` followed by the attachment's filename.
     * @param {number} [height] The height of the media.
     * @param {number} [width] The width of the media.
     */
    constructor (url: string, height?: number, width?: number) {
        super();
        this.url = url;
        this.height = height;
        this.width = width;
    }

    /**
     * Set the URL of the media.
     * 
     * @param {string} url The URL of the media. If refrences an attachment, prefix with `attachment://` followed by the attachment's filename.
     * @returns {EmbedMedia} The updated EmbedMedia.
     */
    setUrl (url: string): EmbedMedia {
        this.url = url;
        return this;
    }

    /**
     * Set the height of the media.
     * 
     * @param {number | null} height The height of the media. `null` to remove the height.
     * @returns {EmbedMedia} The updated EmbedMedia.
     */
    setHeight (height: number): EmbedMedia {
        this.height = height;
        return this;
    }

    /**
     * Set the width of the media.
     * 
     * @param {number | null} width The width of the media. `null` to remove the width.
     * @returns {EmbedMedia} The updated EmbedMedia.
     */
    setWidth (width: number): EmbedMedia {
        this.width = width;
        return this;
    }

    /**
     * Remove the height of the media.
     * 
     * @returns {EmbedMedia} The updated EmbedMedia.
     */
    removeHeight (): EmbedMedia {
        this.height = undefined;
        return this;
    }

    /**
     * Remove the width of the media.
     * 
     * @returns {EmbedMedia} The updated EmbedMedia.
     */
    removeWidth (): EmbedMedia {
        this.width = undefined;
        return this;
    }

    /**
     * Format this class into an API-acceptable object.
     * 
     * @returns {any} The formatted object.
     */
    format (): any {
        return {
            url: this.url,
            height: this.height,
            width: this.width
        };
    }

}
