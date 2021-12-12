/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import StopDoingBadThingsError from '../../../errors/StopDoingBadThingsError';
import { Status } from '../../../util/Constants';
import ClientUser from '../../ClientUser';
import Websocket from '../Websocket';

export default async function READY (ws: Websocket, data: any): Promise<void> {
    if (!data.user.bot) {
        console.error(new StopDoingBadThingsError('self-bots (non-bot automated accounts) are banned from accessing the Discord API Gateway by Discord and are not supported by the Birb.JS library; to use Birb.JS you must use a bot account otherwise you may have your account BANNED by Discord; use a bot token instead\nMore info: https://support.discord.com/hc/en-us/articles/115002192352-Automated-user-accounts-self-bots-').compact());
        ws.preventReconnect(true);
        ws.client._invalidate();
        // we close instead of terminating for discord's sake
        ws.close(1008);
        return;
    }

    ws.client.me = new ClientUser(ws.client, data.user);
    ws.client.debug('everything seems ok; sending a heartbeat now...');
    ws.heartbeat();

    ws.expectedGuilds = new Set(data.guilds.map((d: any) => d.id));
    ws.setSessionIdentifier(data.session_id);
    ws.setStatus(Status.WAITING_FOR_GUILDS);
    ws.client.emit('waitingForGuilds');

    if (!ws.expectedGuilds) {
        ws.client.debug('we didn\'t need to receive any guilds; marking as ready');
        ws.setStatus(Status.READY);
        ws.client.emit('ready');
    }
}
