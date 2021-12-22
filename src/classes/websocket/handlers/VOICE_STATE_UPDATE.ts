/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import VoiceState from '../../VoiceState';
import Websocket from '../Websocket';

export default async function VOICE_STATE_UPDATE (ws: Websocket, data: any): Promise<void> {
    ws.client.debug(`received voice update: ${data.user_id}`);

    let guild = ws.client.guilds.cache.get(data.guild_id);
    if (!data.channel_id) {
        let member = guild.members.resolve(data.user_id, data.member ?? undefined);
        if (!member) member = await guild.members.fetch(data.user_id);
        ws.client.emit('voiceLeave', member);
        return;
    }

    let channel = guild?.channels.cache.get(data.channel_id);
    let old = channel.states.cache.get(data.user_id) ?? null;
    let state = new VoiceState(ws.client, channel, data);
    ws.client.emit('voiceStateUpdate', old, state);
}
