/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Guild from './Guild';
import HTTPChannel from './http/HTTPChannel';
import Client from './Client';
import TextBasedChannel from './TextBasedChannel';

export default class TextChannel extends TextBasedChannel {

    /**
     * A TextChannel represents any guild text channel on
     * Discord.
     * 
     * @param {Client} client The client this channel belongs to.
     * @param {any} data The data of this channel.
     * @param {object} [options] The options of this channel.
     * @param {number} [options.maxSize=null] The maximum size of the cache.
     * @param {number} [options.maxAge=null] The maximum age (in seconds) of the values in the cache.
     * @param {number} [options.checkInterval=60] The interval (in seconds) to check for old values in the cache.
     * @param {boolean} [options.removeOldest=true] Whether to remove the oldest values when the cache is full.
     * @param {Guild} guild The guild this channel belongs to.
     */
    constructor (client: Client, data: any, options?: {
        maxSize?: number,
        maxAge?: number,
        checkInterval?: number,
        removeOldest?: boolean,
    }, guild?: Guild) {
        super(client, data, options, guild);
        this.build(data);
    }

    /**
     * Build the TextChannel.
     * 
     * @param {any} data The data of this channel.
     */
    private build (data: any): TextChannel {
        return this;
    }

    /**
     * Set the topic of this channel.
     * 
     * @param {string} topic The topic of this channel.
     * @param {string} [reason] The reason for changing the topic.
     * @returns {Promise<TextChannel>} This TextChannel instance.
     */
    setTopic (topic: string, reason?: string): Promise<TextChannel> {
        return this.modify({ topic }, reason);
    }

    /**
     * Set whether or not this channel is Not Safe For
     * Wumpus (explict).
     * 
     * @param {boolean} nsfw Whether or not this channel is explicit.
     * @param {string} [reason] The reason for changing the NSFW status.
     * @returns {Promise<TextChannel>} This TextChannel instance.
     */
    setNSFW (nsfw: boolean, reason?: string): Promise<TextChannel> {
        return this.modify({ nsfw }, reason);
    }

    /**
     * Sets the slowmode of this channel.
     * 
     * @param {number} seconds The number of seconds of slowmode.
     * @param {string} [reason] The reason for changing the slowmode.
     * @returns {Promise<TextChannel>} This TextChannel instance.
     */
    setSlowmode (seconds: number, reason?: string): Promise<TextChannel> {
        return this.modify({ rate_limit_per_user: seconds }, reason);
    }

    /**
     * Set the auto-archive timeout of this channel.
     * 
     * @param {number} minutes The auto-archive timeout of this channel in minutes.
     * @param {string} [reason] The reason for changing the auto-archive timeout.
     * @returns {Promise<TextChannel>} This TextChannel instance.
     */
    setAutoArchive (minutes: number, reason?: string): Promise<TextChannel> {
        return this.modify({ default_auto_archive_duration: minutes }, reason);
    }

    /**
     * Send a raw modify request to the Discord API.
     * 
     * @param {any} data The data to send.
     * @param {string} [reason] The reason for modifying this channel.
     * @returns {Promise<TextChannel>} This TextChannel instance.
     */
    async modify (data: any, reason?: string): Promise<TextChannel> {
        let updated = await HTTPChannel.modify(this.client, this.id, data, reason);
        this.build(updated);
        return this.set();
    }

    /**
     * Set the TextChannel's data to the cache.
     * 
     * @returns {TextChannel} This TextChannel instance.
     */
    protected set (): TextChannel {
        this.guild.channels.cache.set(this.id, this);
        return this;
    }

}
