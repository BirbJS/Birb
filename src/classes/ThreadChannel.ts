/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import HTTPChannel from './http/HTTPChannel';
import Client from './Client';
import TextBasedChannel from './TextBasedChannel';

export default class ThreadChannel extends TextBasedChannel {

    constructor (client: Client, data: any, options?: {
        maxSize?: number,
        maxAge?: number,
        checkInterval?: number,
        removeOldest?: boolean,
    }) {
        super(client, data, options);
        this.build(data);
    }

    private build (data: any) {
        console.log(data);
    }

    async modify (data: any, reason?: string): Promise<ThreadChannel> {
        let updated = await HTTPChannel.modify(this.client, this.id, data, reason);
        this.build(updated);
        return this.set();
    }

    /**
     * Set the ThreadChannel's data to the cache.
     * 
     * @returns {ThreadChannel} This ThreadChannel instance.
     * @protected
     */
    protected set (): ThreadChannel {
        this.guild.channels.cache.set(this.id, this);
        return this;
    }

}
