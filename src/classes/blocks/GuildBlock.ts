/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Guild from '../Guild';
import Client from '../Client';
import Cache from '../Cache';
import { GuildResolvable } from '../../util/Types';
import HTTPGuild from '../http/HTTPGuild';
import CachedBlock from './CachedBlock';

export default class GuildBlock extends CachedBlock {

    constructor (client: Client, options?: any) {
        super(client, new Cache(options));
    }

    async fetch (options: GuildResolvable | {
        guild: GuildResolvable,
        shouldCache?: boolean,
        bypassCache?: boolean,
    }): Promise<Guild> {
        if (typeof options === 'string') {
            options = {
                guild: options,
                shouldCache: true,
                bypassCache: false,
            }
        } else if (options instanceof Guild) {
            options = {
                guild: options.id,
                shouldCache: true,
                bypassCache: false,
            }
        } else {
            options.shouldCache ??= true;
            options.bypassCache ??= false;
            if (options.guild instanceof Guild) options.guild = options.guild.id;
            else options.guild = options.guild as string;
        }

        if (!options.bypassCache) {
            const cached = this.cache.get(options.guild as string);
            if (cached) {
                console.log(cached);
                return cached;
            }
        }

        let guild = await HTTPGuild.get(this.client, options.guild as string);
        guild = new Guild(this.client, guild);
        console.log(guild);
        if (options.shouldCache) this.cache.set(guild.id, guild);

        return guild;
    }

}
