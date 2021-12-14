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
import GuildChannel from '../GuildChannel';
import PermissionOverwrite from '../PermissionOverwrite';
import RolePermissionOverwrite from '../RolePermissionOverwrite';
import User from '../User';
import UserPermissionOverwrite from '../UserPermissionOverwrite';

export default class ChannelPermissionsBlock {

    client: Client = null!;
    channel: GuildChannel = null!;
    overwrites: PermissionOverwrite[] = [];

    constructor (client: Client, channel: GuildChannel, overwrites: any[]) {
        this.client = client;
        this.channel = channel;

        let roles = overwrites.filter(o => o.type === 0);
        let users = overwrites.filter(o => o.type === 1);
        for ( let i = 0; i < roles.length; ++i ) {
            let role = this.channel.guild.roles.cache.get(roles[i]);
            this.overwrites.push(new RolePermissionOverwrite(this.client, role, roles[i].allow, roles[i].deny));
        }
        for ( let i = 0; i < users.length; ++i ) {
            let user = User['retrieveOrBuildPartial'](this.client, { id: users[i] });
            this.overwrites.push(new UserPermissionOverwrite(this.client, user, users[i].allow, users[i].deny));
        }
    }

}
