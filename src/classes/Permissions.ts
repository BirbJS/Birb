/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BitsBlock from './blocks/BitsBlock';

export default class Permissions extends BitsBlock {

    /**
     * The permission flags available.
     */
    static FLAGS = {
        /**
         * Create invite links.
         */
        CREATE_INSTANT_INVITE: 1 << 0,
        /**
         * Kick other members.
         */
        KICK_MEMBERS: 1 << 1,
        /**
         * Ban other members.
         */
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
        /**
         * Manage channels in this guild.
         */
        MANAGE_CHANNELS: 1 << 4,
        /**
         * Manage the guild's settings.
         */
        MANAGE_GUILD: 1 << 5,
        /**
         * Add reactions to messages. Users without this
         * permission will still be able to react to 
         * already-added reactions.
         */
        ADD_REACTIONS: 1 << 6,
        /**
         * View the guild's audit log.
         */
        VIEW_AUDIT_LOG: 1 << 7,
        /**
         * Grants the ability to speak in priority mode.
         * Whilst a member is speaking in priority mode,
         * everyone else's volume is decreased until the
         * priority member stops speaking.
         */
        PRIORITY_SPEAKER: 1 << 8,
        /**
         * Stream games and video to the channel.
         */
        STREAM: 1 << 9,
        /**
         * View the guild's channels.
         */
        VIEW_CHANNEL: 1 << 10,
        /**
         * Send messages in the guild's channels.
         */
        SEND_MESSAGES: 1 << 11,
        /**
         * Send text-to-speach messages in the guild's
         * channels.
         */
        SEND_TTS_MESSAGES: 1 << 12,
        /**
         * Delete and/or report messages in the guild's
         * channels.
         */
        MANAGE_MESSAGES: 1 << 13,
        /**
         * Embed links and GIFs in messages.
         */
        EMBED_LINKS: 1 << 14,
        /**
         * Attach files to messages.
         */
        ATTACH_FILES: 1 << 15,
        /**
         * Read messages sent before launching the client.
         */
        READ_MESSAGE_HISTORY: 1 << 16,
        /**
         * Mention @everyone, @here, and all roles.
         */
        MENTION_EVERYONE: 1 << 17,
        /**
         * Use emojis from other guilds.
         */
        USE_EXTERNAL_EMOJIS: 1 << 18,
        /**
         * View the guild's insights and stats.
         */
        VIEW_GUILD_INSIGHTS: 1 << 19,
        /**
         * Connect to voice channels.
         */
        CONNECT: 1 << 20,
        /**
         * Speak in voice channels.
         */
        SPEAK: 1 << 21,
        /**
         * Mute members in voice channels.
         */
        MUTE_MEMBERS: 1 << 22,
        /**
         * Deafen members in voice channels.
         */
        DEAFEN_MEMBERS: 1 << 23,
        /**
         * Move members between voice channels and
         * disconnect them completely.
         */
        MOVE_MEMBERS: 1 << 24,
        /**
         * Use voice-activity-detection in voice channels.
         * Removes the need of push-to-talk.
         */
        USE_VAD: 1 << 25,
        /**
         * Change their own nickname.
         */
        CHANGE_NICKNAME: 1 << 26,
        /**
         * Change the nicknames of other members.
         */
        MANAGE_NICKNAMES: 1 << 27,
        /**
         * Manage the guild's roles, including creating,
         * editing, and deleting the roles, and modify the
         * roles of themselves and other members.
         */
        MANAGE_ROLES: 1 << 28,
        /**
         * Create, modify, and delete webhooks, and follow
         * external text channels.
         */
        MANAGE_WEBHOOKS: 1 << 29,
        /**
         * Create, modify, and delete emojis and stickers.
         */
        MANAGE_EMOJIS_AND_STICKERS: 1 << 30,
        /**
         * Use slash and application commands.
         */
        USE_APPLICATION_COMMANDS: 1 << 31,
        /**
         * Request to speak in stage channels.
         */
        REQUEST_TO_SPEAK: 1 << 32,
        /**
         * Manage guild events.
         */
        MANAGE_EVENTS: 1 << 33,
        /**
         * Delete and modify threads.
         */
        MANAGE_THREADS: 1 << 34,
        /**
         * Create public threads.
         */
        CREATE_PUBLIC_THREADS: 1 << 35,
        /**
         * Create private threads.
         */
        CREATE_PRIVATE_THREADS: 1 << 36,
        /**
         * Use stickers from other guilds.
         */
        USE_EXTERNAL_STICKERS: 1 << 37,
        /**
         * Send messages in threads.
         */
        SEND_MESSAGES_IN_THREADS: 1 << 38,
        /**
         * Start embedded activities and applications.
         */
        START_EMBEDDED_ACTIVITIES: 1 << 39,
    }

    /**
     * Permissions objects store permission data.
     * 
     * @param {number} flags The permission flags.
     */
    constructor (...flags: number[]) {
        super(...flags);
    }

    /**
     * Check whether or not the permission flags exist on
     * this Permissions object, whilst taking the
     * administrator permission into account. If you want
     * to ignore the administrator permission, use the
     * `has` method instead.
     * 
     * @param {number} flag The permission flag to check for.
     * @returns {boolean} Whether or not the permission flag exists.
     */
    hasPermission (flag: number): boolean {
        return this.has(flag) || this.has(Permissions.FLAGS.ADMINISTRATOR);
    }

}
