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
import Websocket from "../Websocket";

export default async function READY (ws: Websocket, data: any): Promise<void> {
    ws.expectedGuilds = new Set(data.guilds.map((d: any) => d.id));
    ws.setSessionIdentifier(data.session_id);
    ws.setStatus(Status.WAITING_FOR_GUILDS);

    if (!ws.expectedGuilds) {
        ws.client.debug('we didn\'t need to receive any guilds; marking as ready');
        ws.setStatus(Status.READY);
        ws.client.emit('ready');
    }
}
