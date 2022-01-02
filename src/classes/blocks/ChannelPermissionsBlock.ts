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
  /**
   * The client that initiliazed the block.
   */
  client: Client = null!;
  /**
   * The channel this permissions block is for.
   */
  channel: GuildChannel = null!;
  /**
   * The list of permission overwrites.
   */
  overwrites: PermissionOverwrite[] = [];

  /**
   * A ChannelPermissionsBlock stores data about channel
   * permissions.
   *
   * @param {Client} client The client instance.
   * @param {GuildChannel} channel The channel this permissions block is for.
   * @param {any[]} overwrites The data to parse.
   */
  constructor(client: Client, channel: GuildChannel, overwrites: any[]) {
    this.client = client;
    this.channel = channel;

    let roles = overwrites.filter(o => o.type === 0);
    let users = overwrites.filter(o => o.type === 1);
    for (let i = 0; i < roles.length; ++i) {
      let role = this.channel.guild.roles.cache.get(roles[i]);
      this.overwrites.push(new RolePermissionOverwrite(this.client, role, roles[i].allow, roles[i].deny));
    }
    for (let i = 0; i < users.length; ++i) {
      let user = User['retrieveOrBuildPartial'](this.client, { id: users[i] });
      this.overwrites.push(new UserPermissionOverwrite(this.client, user, users[i].allow, users[i].deny));
    }
  }
}
