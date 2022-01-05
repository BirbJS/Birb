/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Guild from '../../Guild';
import Websocket from '../Websocket';

export default async function GUILD_UPDATE(ws: Websocket, data: any): Promise<void> {
  ws.client.debug(`received guild update: ${data.id}`);

  let guild = new Guild(ws.client, data)['set']();
  ws.client.emit('guildUpdate', guild);
}
