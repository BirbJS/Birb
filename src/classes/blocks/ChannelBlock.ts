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
import CCache from '../cache/CCache';

export default class ChannelBlock extends CachedBlock {

    /**
     * The cache full of channels.
     */
    cache: CCache = null!;

    /**
     * A ChannelBlock stores channel data.
     * 
     * @param {Client} client The client instance.
     * @param {any} [options] The Cache options.
     */
    constructor (client: Client, options?: any) {
        super(client, new CCache(client, options));
    }

}
