/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Client from '../Client';
import Guild from '../Guild';
import GuildChannel from '../GuildChannel';
import Cache from './Cache';

export default class CGCCache extends Cache {

    /**
     * The client that initialized the cache.
     */
    client: Client = null!;
    /**
     * The guild instance this cache is for.
     */
    guild: Guild = null!;
    /**
     * The channel instance this cache is for.
     */
    channel: GuildChannel = null!;

    /**
     * Creates a new CCache instance.
     * 
     * @param {Client} client The client instance.
     * @param {Guild} guild The guild instance.
     * @param {GuildChannel} channel The channel instance.
     * @param {object} [options] The Cache options.
     * @param {number} [options.maxSize=null] The maximum size of the cache.
     * @param {number} [options.maxAge=null] The maximum age (in seconds) of the values in the cache.
     * @param {number} [options.checkInterval=60] The interval (in seconds) to check for old values in the cache.
     * @param {boolean} [options.removeOldest=true] Whether to remove the oldest values when the cache is full.
     */
    constructor (client: Client, guild: Guild, channel: GuildChannel, options?: {
        maxSize?: number,
        maxAge?: number,
        checkInterval?: number,
        removeOldest?: boolean,
    }) {
        super(options);
        this.client = client;
        this.guild = guild;
        this.channel = channel;
    }

    strip (data: any): any {
        delete data.client;
        delete data.guild;
        delete data.channel;
        return data;
    }

    rebuild (data: any): any {
        data.client = this.client;
        data.guild = this.guild;
        data.channel = this.channel;
        return data;
    }

}
