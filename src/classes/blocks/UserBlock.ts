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
import ClientUser from '../ClientUser';
import HTTPUser from '../http/HTTPUser';
import User from '../User';
import { UserResolvable } from '../../util/Types';
import BaseUser from '../BaseUser';
import CCache from '../cache/CCache';

export default class UserBlock extends CachedBlock {
  /**
   * A UserBlock stores user data.
   *
   * @param {Client} client The client instance.
   * @param {any} [options] The Cache options.
   */
  constructor(client: Client, options?: any) {
    super(client, new CCache(client, options));
  }

  /**
   * Fetches this Client's user.
   *
   * @returns {Promise<User>} The Client's user.
   */
  async fetchMe(): Promise<ClientUser> {
    let user = await HTTPUser.getCurrent(this.client);
    user = new ClientUser(this.client, user);
    this.cache.set(user.id, user);
    return user;
  }

  /**
   * Fetches a user from the Cache or the Discord API if
   * the user is not cached.
   *
   * @param {string} userId The ID of the user to fetch.
   * @param {object} [options] The options to use.
   * @param {boolean} [options.shouldCache=true] Whether to cache the user.
   * @param {boolean} [options.bypassCache=false] Whether to bypass the cache and fetch the user directly from the API.
   * @returns {Promise<User>} The user.
   */
  async fetch(
    userId: string,
    options?: {
      shouldCache?: boolean;
      bypassCache?: boolean;
    }
  ): Promise<User> {
    options = options || {};
    options.shouldCache = options.shouldCache ?? true;
    options.bypassCache = options.bypassCache ?? false;

    if (!options.bypassCache) {
      const cached = this.cache.get(userId);
      if (cached) return cached;
    }

    let user = await HTTPUser.get(this.client, userId);
    user = new User(this.client, user);
    if (options.shouldCache) user['set']();

    return user;
  }

  /**
   * Resolves a UserResolvable to a user if the user is
   * in the cache.
   *
   * @param {UserResolvable} user The user to resolve.
   * @param {any} [def] The default value to build the user if the user is not cached.
   * @returns {User | null} The user. `null` if the user is not cached.
   */
  resolve(user: UserResolvable, def?: any): User | null {
    if (user instanceof BaseUser) return this.cache.get(user.id) ?? user;
    else if (typeof user === 'string') {
      if (def) return this.cache.get(user) ?? new User(this.client, def);
      else return this.cache.get(user) ?? null;
    } else return null;
  }
}
