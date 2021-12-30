/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Websocket from '../Websocket';
import Role from '../../Role';

export default async function GUILD_ROLE_UPDATE(ws: Websocket, data: any): Promise<void> {
  if (!data.guild_id) return;
  let guild = await ws.client.guilds.fetch(data.guild_id);

  ws.client.debug(`received role update: ${data.role.id} / ${guild.id}`);
  let role = Role['handleUpdate'](ws.client, data.role, guild);
  ws.client.emit('roleUpdate', role);
}
