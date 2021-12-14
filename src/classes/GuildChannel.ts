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
import Client from './Client';
import ChannelPermissionsBlock from './blocks/ChannelPermissionsBlock';

export default abstract class GuildChannel extends Channel {

    guild: Guild = null!;
    permissions: ChannelPermissionsBlock = null!;

    constructor (client: Client, data: any, guild?: Guild) {
        super(client, data);
        this.guild = guild ?? client.guilds.cache.get(data.guild_id);
        this.permissions = new ChannelPermissionsBlock(client, this, data.permission_overwrites);
    }

    protected setOverwrite (overwrite: {
        id: string,
        type: 'role' | 'member',
    }) {

    }

    abstract modify (data: any, reason?: string): Promise<GuildChannel>;

}
