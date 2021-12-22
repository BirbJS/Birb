/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import GuildChannel from './GuildChannel';
import Guild from './Guild';
import Client from './Client';
import HTTPChannel from './http/HTTPChannel';
import VoiceStateBlock from './blocks/VoiceStateBlock';

export default class VoiceChannel extends GuildChannel {

    /**
     * The voice states of this voice channel.
     */
    states: VoiceStateBlock = null!;
    /**
     * The bitrate of the channel.
     */
    bitrate: number = 64000;
    /**
     * The maximum amount of users that can be in this
     * voice channel. `null` if there is no limit.
     */
    userLimit: number | null = null;

    /**
     * A VoiceChannel represents any guild voice channel on
     * Discord.
     * 
     * @param {Client} client The client this channel belongs to.
     * @param {any} data The data of this channel.
     * @param {Guild} guild The guild this channel belongs to.
     */
    constructor (client: Client, data: any, guild: Guild) {
        super(client, data, guild);
        this.states = new VoiceStateBlock(client, this.guild, this, this);
        this.build(data);
    }

    /**
     * Build the VoiceChannel.
     * 
     * @param {any} data The data of this channel.
     */
    private build (data: any): VoiceChannel {
        if ('bitrate' in data) {
            this.bitrate = data.bitrate;
        }
        if ('user_limit' in data) {
            this.userLimit = data.user_limit || null;
        }

        return this;
    }
    
    /**
     * Send a raw modify request to the Discord API.
     * 
     * @param {any} data The data to send.
     * @param {string} [reason] The reason for modifying this channel.
     * @returns {Promise<VoiceChannel>} This VoiceChannel instance.
     */
    async modify (data: any, reason?: string): Promise<VoiceChannel> {
        let updated = await HTTPChannel.modify(this.client, this.id, data, reason);
        this.build(updated);
        return this.set();
    }

    /**
     * Set the VoiceChannel's data to the cache.
     * 
     * @returns {VoiceChannel} This VoiceChannel instance.
     */
    protected set (): VoiceChannel {
        this.guild.channels.cache.set(this.id, this);
        return this;
    }

}
