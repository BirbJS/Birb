/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Channel from './Channel';
import Guild from './Guild';

export default class GuildChannel extends Channel {

    guild: Guild = null!;

    /**
     * Set the GuildChannel's data to the cache.
     * 
     * @returns {GuildChannel} This GuildChannel instance.
     * @protected
     */
    protected set (): GuildChannel {
        this.guild.channels.cache.set(this.id, this);
        return this;
    }

}
