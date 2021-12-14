/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BitsBlock from "./blocks/BitsBlock";

export default class Permissions extends BitsBlock {

    static FLAGS = {
        CREATE_INSTANT_INVITE: 1 << 0,
        KICK_MEMBERS: 1 << 1,
        BAN_MEMBERS: 1 << 2,
        /**
         * ⚠️ **No bot truly needs the Administrator
         * permission** with the exception of some
         * moderation and anti-abuse type bots. You should
         * consider whether or not a group of less
         * priviliged permissions would suffice for your
         * use case. Requesting the Administrator
         * permission just puts your users at risk and can
         * lead to unneeded privacy concerns.
         */
        ADMINISTRATOR: 1 << 3,
        MANAGE_CHANNELS: 1 << 4,
        MANAGE_GUILD: 1 << 5,
        ADD_REACTIONS: 1 << 6,
        VIEW_AUDIT_LOG: 1 << 7,
        PRIORITY_SPEAKER: 1 << 8,
        STREAM: 1 << 9,
        VIEW_CHANNEL: 1 << 10,
        SEND_MESSAGES: 1 << 11,
        SEND_TTS_MESSAGES: 1 << 12,
        MANAGE_MESSAGES: 1 << 13,
        EMBED_LINKS: 1 << 14,
        ATTACH_FILES: 1 << 15,
        READ_MESSAGE_HISTORY: 1 << 16,
        MENTION_EVERYONE: 1 << 17,
        USE_EXTERNAL_EMOJIS: 1 << 18,
        VIEW_GUILD_INSIGHTS: 1 << 19,
        CONNECT: 1 << 20,
        SPEAK: 1 << 21,
        MUTE_MEMBERS: 1 << 22,
        DEAFEN_MEMBERS: 1 << 23,
        MOVE_MEMBERS: 1 << 24,
        USE_VAD: 1 << 25,
        CHANGE_NICKNAME: 1 << 26,
        MANAGE_NICKNAMES: 1 << 27,
        MANAGE_ROLES: 1 << 28,
        MANAGE_WEBHOOKS: 1 << 29,
        MANAGE_EMOJIS_AND_STICKERS: 1 << 30,
        USE_APPLICATION_COMMANDS: 1 << 31,
        REQUEST_TO_SPEAK: 1 << 32,
        MANAGE_EVENTS: 1 << 33,
        MANAGE_THREADS: 1 << 34,
        CREATE_PUBLIC_THREADS: 1 << 35,
        CREATE_PRIVATE_THREADS: 1 << 36,
        USE_EXTERNAL_STICKERS: 1 << 37,
        SEND_MESSAGES_IN_THREADS: 1 << 38,
        START_EMBEDDED_ACTIVITIES: 1 << 39,
    }

    constructor (...flags: number[]) {
        super(...flags);
    }

    hasPermission (flag: number): boolean {
        return this.has(flag) || this.has(Permissions.FLAGS.ADMINISTRATOR);
    }

}
