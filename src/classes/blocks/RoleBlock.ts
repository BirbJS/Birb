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
import CGCache from '../cache/CGCache';
import Guild from '../Guild';

export default class RoleBlock extends CachedBlock {

    /**
     * A RoleBlock stores information on roles.
     * 
     * @param {Client} client The client instance.
     * @param {Guild} guild The guild instance.
     * @param {any} [options] The Cache options.
     */
    constructor (client: Client, guild: Guild, options?: any) {
        super(client, new CGCache(client, guild, options));
    }

}
