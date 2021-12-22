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
import CGCCache from '../cache/CGCCache';
import Guild from '../Guild';
import GuildChannel from '../GuildChannel';

export default class VoiceStateBlock extends CachedBlock {

    /**
     * A MessageBlock stores information on messages.
     * 
     * @param {Client} client The client instance.
     * @param {Guild} guild The guild instance.
     * @param {GuildChannel} channel The channel instance.
     * @param {any} [options] The Cache options.
     */
    constructor (client: Client, guild: Guild, channel: GuildChannel, options?: any) {
        super(client, new CGCCache(client, guild, channel, options));
    }

}
