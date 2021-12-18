/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Color from '../../../util/Color';
import BaseComponent from '../BaseComponent';
import EmbedAuthor from './EmbedAuthor';
import EmbedField from './EmbedField';
import EmbedFooter from './EmbedFooter';
import EmbedMedia from './EmbedMedia';

export default class MessageEmbed extends BaseComponent {

    /**
     * The title of this embed.
     */
    title: string | null = null;
    /**
     * The description of this embed.
     */
    description: string | null = null;
    /**
     * The URL of this embed (makes the title clickable).
     */
    url: string | null = null;
    /**
     * The timestamp of this embed (shows in the footer).
     */
    timestamp: Date | null = null;
    /**
     * The color of this embed as a hex string.
     */
    color: string | null = null;
    /**
     * The footer of this embed.
     */
    footer: EmbedFooter | null = null;
    /**
     * The image in this embed.
     */
    image: EmbedMedia | null = null;
    /**
     * The thumbnail for this embed.
     */
    thumbnail: EmbedMedia | null = null;
    /**
     * The video for this embed (usually not settable).
     */
    video: EmbedMedia | null = null;
    /**
     * The author of this embed.
     */
    author: EmbedAuthor | null = null;
    /**
     * This embed's fields.
     */
    fields: EmbedField[] = [];

    /**
     * The MessageEmbed class represents a message embed on
     * Discord. A message embed is a rich embed that can
     * include a lot of formatted data (they can also have
     * their color set which is quite nice).
     */
    constructor () {
        super();
    }

    /**
     * Set the title of this embed.
     * 
     * @param {string} title The new title of this embed.
     * @returns {MessageEmbed} This embed.
     */
    setTitle (title: string): MessageEmbed {
        this.title = title;
        return this;
    }

    /**
     * Set the description of this embed.
     * 
     * @param {string} description The new description of this embed.
     * @returns {MessageEmbed} This embed.
     */
    setDescription (description: string): MessageEmbed {
        this.description = description;
        return this;
    }

    /**
     * Set the URL of this embed.
     * 
     * @param {string} url The new URL of this embed.
     * @returns {MessageEmbed} This embed.
     */
    setUrl (url: string): MessageEmbed {
        this.url = url;
        return this;
    }

    /**
     * Set the timestamp of this embed.
     * 
     * @param {Date | number} timestamp The new timestamp of this embed.
     * @returns {MessageEmbed} This embed.
     */
    setTimestamp (timestamp: Date | number): MessageEmbed {
        if (typeof timestamp == 'number') timestamp = new Date(timestamp);
        this.timestamp = timestamp;
        return this;
    }

    /**
     * Set the HEX color of this embed.
     * 
     * @param {string} color The new HEX color of this embed.
     * @returns {MessageEmbed} This embed.
     */
    setColor (color: string): MessageEmbed {
        this.color = color;
        return this;
    }

    /**
     * Set the footer of this embed.
     * 
     * @param {string} text The text of the footer.
     * @param {string} [iconUrl] A public-facing URL to an image for the footer.
     * @returns {MessageEmbed} This embed.
     */
    setFooter (text: string, iconUrl?: string): MessageEmbed {
        this.footer = new EmbedFooter(text, iconUrl);
        return this;
    }

    /**
     * Set the image for this embed.
     * 
     * @param {string} url A public-facing URL to an image for the embed.
     * @param {number} [height] An optional height for the image.
     * @param {number} [width] An optional width for the image.
     * @returns {MessageEmbed} This embed.
     */
    setImage (url: string, height?: number, width?: number): MessageEmbed {
        this.image = new EmbedMedia(url, height, width);
        return this;
    }

    /**
     * Set the thumbnail for this embed.
     * 
     * @param {string} url A public-facing URL to an image for the embed.
     * @param {number} [height] An optional height for the image.
     * @param {number} [width] An optional width for the image.
     * @returns {MessageEmbed} This embed.
     */
    setThumbnail (url: string, height?: number, width?: number): MessageEmbed {
        this.thumbnail = new EmbedMedia(url, height, width);
        return this;
    }

    /**
     * Set the video for this embed.
     * 
     * @param {string} url A public-facing URL to a video for the embed.
     * @param {number} [height] An optional height for the video.
     * @param {number} [width] An optional width for the video.
     * @returns {MessageEmbed} This embed.
     */
    setVideo (url: string, height?: number, width?: number): MessageEmbed {
        this.video = new EmbedMedia(url, height, width);
        return this;
    }

    /**
     * Set the author of this embed.
     * 
     * @param {string} name The name of the author.
     * @param {string} [url] A public-facing URL for the author.
     * @param {string} [iconUrl] A public-facing URL to an image for the author.
     * @returns {MessageEmbed} This embed.
     */
    setAuthor (name: string, url?: string, iconUrl?: string): MessageEmbed {
        this.author = new EmbedAuthor(name, url, iconUrl);
        return this;
    }

    /**
     * Add a field to this embed.
     * 
     * @param {string} name The name of the field.
     * @param {string} value The field's value.
     * @param {boolean} [inline=false] Whether or not this field should be displayed inline.
     * @returns {MessageEmbed} This embed.
     */
    addField (name: string, value: string, inline?: boolean): MessageEmbed {
        this.fields.push(new EmbedField(name, value, inline));
        return this;
    }

    /**
     * Add multiple fields to this embed.
     * 
     * @param {Object[]} fields The fields to add to this embed.
     * @param {string} fields.name The name of the field.
     * @param {string} fields.value The field's value.
     * @param {boolean} [fields.inline=false] Whether or not the field should be displayed inline.
     * @returns {MessageEmbed} This embed.
     */
    addFields (fields: {
        name: string,
        value: string,
        inline?: boolean
    }[]): MessageEmbed {
        for (let field of fields) this.addField(field.name, field.value, field.inline);
        return this;
    }

    /**
     * Remove a field from this embed.
     * 
     * @param {number} index The array index of the field to remove.
     * @returns {MessageEmbed} This embed.
     */
    removeField (index: number): MessageEmbed {
        this.fields.splice(index, 1);
        return this;
    }

    /**
     * Set the fields of this embed.
     * 
     * @param {Object[]} fields The new fields of this embed.
     * @param {string} fields.name The name of the field.
     * @param {string} fields.value The field's value.
     * @param {boolean} [fields.inline=false] Whether or not the field should be displayed inline.
     * @returns {MessageEmbed} This embed.
     */
    setFields (fields: {
        name: string,
        value: string,
        inline?: boolean
    }[]): MessageEmbed {
        this.fields = [];
        for ( let i = 0; i < fields.length; ++i ) {
            this.fields.push(new EmbedField(fields[i].name, fields[i].value, fields[i].inline));
        }
        return this;
    }

    /**
     * Format this class into an API-acceptable object.
     * 
     * @returns {any} The formatted object.
     */
    format (): any {
        return {
            title: this.title,
            type: 'rich',
            description: this.description,
            url: this.url,
            timestamp: this.timestamp?.toISOString(),
            color: this.color ? Color.hexToInt(this.color): null,
            footer: this.footer?.format(),
            image: this.image?.format(),
            thumbnail: this.thumbnail?.format(),
            video: this.video?.format(),
            author: this.author?.format(),
            fields: this.fields.map(field => field.format())
        }
    }

}
