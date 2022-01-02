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
  /**
   * The guild that the block is for.
   */
  guild: Guild = null!;

  /**
   * A GuildMemberBlock stores guild member data.
   *
   * @param {Client} client The client instance.
   * @param {Guild} guild The guild that the block is for.
   * @param {any} [options] The Cache options.
   */
  constructor(client: Client, guild: Guild, options?: any) {
    super(client, new CGCache(client, guild, options));
    this.guild = guild;
  }

  /**
   * Fetch a guild member from the cache or the Discord\
   * API if it is not in the cache.
   *
   * @param {string} userId The user's ID.
   * @param {object} [options] The options to pass to the API.
   * @param {boolean} [options.shouldCache=true] Whether or not to cache the member.
   * @param {boolean} [options.bypassCache=false] Whether to force the request to the API, bypassing the cache.
   * @returns {Promise<GuildMember>} The guild member.
   */
  async fetch(
    userId: string,
    options?: {
      shouldCache?: boolean;
      bypassCache?: boolean;
    }
  ): Promise<GuildMember> {
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

  /**
   * Resolve a user to a GuildMember. Returns null if the
   * member is not cached.
   *
   * @param {UserResolvable} user The member to resolve.
   * @param {any} [def] The default value to return if the member is not cached.
   * @returns {GuildMember | null} The member. `null` if the member is not cached.
   */
  resolve(user: UserResolvable, def?: any): GuildMember | null {
    if (user instanceof BaseUser) {
      return this.cache.get(user.id) ?? user;
    } else if (typeof user === 'string') {
      if (def) return this.cache.get(user) ?? new GuildMember(this.client, def, this.guild);
      else return this.cache.get(user) ?? null;
    } else {
      return null;
    }
  }
}
