/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Guild, HTTPChannel } from '..';
import Client from './Client';
import TextBasedChannel from './TextBasedChannel';

export default class TextChannel extends TextBasedChannel {

    constructor (client: Client, data: any, options?: {
        maxSize?: number,
        maxAge?: number,
        checkInterval?: number,
        removeOldest?: boolean,
    }, guild?: Guild) {
        super(client, data, options, guild);
        this.build(data);
    }

    private build (data: any) {
        
    }

    setName (name: string, reason?: string): Promise<TextChannel> {
        return this.modify({ name }, reason);
    }

    setPosition (position: number, reason?: string): Promise<TextChannel> {
        return this.modify({ position }, reason);
    }

    setTopic (topic: string, reason?: string): Promise<TextChannel> {
        return this.modify({ topic }, reason);
    }

    setNSFW (nsfw: boolean, reason?: string): Promise<TextChannel> {
        return this.modify({ nsfw }, reason);
    }

    setSlowmode (seconds: number, reason?: string): Promise<TextChannel> {
        return this.modify({ rate_limit_per_user: seconds }, reason);
    }

    setAutoArchive (minutes: number, reason?: string): Promise<TextChannel> {
        return this.modify({ default_auto_archive_duration: minutes }, reason);
    }

    async modify (data: any, reason?: string): Promise<TextChannel> {
        let updated = await HTTPChannel.modify(this.client, this.id, data, reason);
        this.build(updated);
        return this.set();
    }

    /**
     * Set the TextChannel's data to the cache.
     * 
     * @returns {TextChannel} This TextChannel instance.
     * @protected
     */
    protected set (): TextChannel {
        this.guild.channels.cache.set(this.id, this);
        return this;
    }

}
