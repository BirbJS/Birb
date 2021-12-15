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
import Cache from '../cache/Cache';
import CachedBlock from './CachedBlock';
import ClientUser from '../ClientUser';
import HTTPUser from '../http/HTTPUser';
import User from '../User';
import { UserResolvable } from '../../util/Types';
import BaseUser from '../BaseUser';
import CCache from '../cache/CCache';

export default class UserBlock extends CachedBlock {

    constructor (client: Client, options?: any) {
        super(client, new CCache(client, options));
    }

    async fetchMe (): Promise<ClientUser> {
        let user = await HTTPUser.getCurrent(this.client);
        user = new ClientUser(this.client, user);
        this.cache.set(user.id, user);
        return user;
    }

    async fetch (userId: string, options?: {
        shouldCache?: boolean,
        bypassCache?: boolean,
    }): Promise<User> {
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

    resolve (user: UserResolvable, def?: any): User | null {
        if (user instanceof BaseUser) return this.cache.get(user.id) ?? user;
        else if (typeof user === 'string') {
            if (def) return this.cache.get(user) ?? new User(this.client, def);
            else return this.cache.get(user) ?? null;
        } else return null;
    }

}
