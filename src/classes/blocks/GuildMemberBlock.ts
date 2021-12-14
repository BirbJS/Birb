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
import CachedBlock from './CachedBlock';
import { UserResolvable } from '../../util/Types';
import BaseUser from '../BaseUser';
import GuildMember from '../GuildMember';
import Guild from '../Guild';
import HTTPGuild from '../http/HTTPGuild';
import CGCache from '../cache/CGCache';

export default class GuildMemberBlock extends CachedBlock {

    guild: Guild = null!;

    constructor (client: Client, guild: Guild, options?: any) {
        super(client, new CGCache(client, guild, options));
        this.guild = guild;
    }

    async fetch (userId: string, options?: {
        shouldCache?: boolean,
        bypassCache?: boolean,
    }): Promise<GuildMember> {
        options = options || {};
        options.shouldCache = options.shouldCache ?? true;
        options.bypassCache = options.bypassCache ?? false;

        if (!options.bypassCache) {
            const cached = this.cache.get(userId);
            if (cached) return cached;
        }

        let member = await HTTPGuild.getMember(this.client, this.guild.id, userId);
        member = new GuildMember(this.client, member, this.guild);
        
        if (options.shouldCache) member._set();

        return member;
    }

    resolve (user: UserResolvable, guild: Guild, def?: any): GuildMember | null {
        if (user instanceof BaseUser) {
            return this.cache.get(user.id) ?? user;
        } else if (typeof user === 'string') {
            if (def) return this.cache.get(user) ?? new GuildMember(this.client, def, guild);
            else return this.cache.get(user) ?? null;
        } else {
            return null;
        }
    }

}
