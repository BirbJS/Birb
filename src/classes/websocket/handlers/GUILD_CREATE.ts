/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Status } from "../../..";
import Guild from "../../Guild";
import Websocket from "../Websocket";

export default async function GUILD_CREATE (ws: Websocket, data: any): Promise<void> {
    ws.client.debug(`received guild: ${data.id}`);

    let guild = new Guild(ws.client, data)._set();

    if (ws.status === Status.WAITING_FOR_GUILDS) {
        ws.expectedGuilds.delete(data.id);
        ws.client.emit('guildAvailable', guild);
        if (ws.expectedGuilds.size === 0) {
            setTimeout(() => {
                ws.client.debug(`we've received all guilds; setting to ready`);
                ws.setStatus(Status.READY);
                ws.client.emit('ready');
            }, 500);
        }
    } else {
        ws.client.emit('guildCreate', guild);
    }
}
