/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Guild from './Guild';
import Client from './Client';
import GuildMember from './GuildMember';
import VoiceChannel from './VoiceChannel';

export default class VoiceState {
    
    /**
     * The client this message belongs to.
     */
    client: Client = null!;
    /**
     * The guild this voice state belongs to.
     */
    guild: Guild = null!;
    /**
     * The voice channel.
     */
    channel: VoiceChannel = null!;
    /**
     * The ID of the voice state's session.
     */
    sessionId: string | null = null;
    /**
     * The member of the voice state. If `null`, you should
     * run the `fetch()` method to fetch the member from
     * the Discord API.
     */
    member: GuildMember | null = null;
    /**
     * The ID of the member.
     */
    memberId: string = null!;
    /**
     * Whether or not the member is server deafened.
     */
    deaf: boolean = false;
    /**
     * Whether or not the member is server muted.
     */
    mute: boolean = false;
    /**
     * Whether or not the member has deafened themself.
     */
    selfDeaf: boolean = false;
    /**
     * Whether or not the member has muted themself.
     */
    selfMute: boolean = false;
    /**
     * Whether or not the member is streaming.
     */
    streaming: boolean = false;
    /**
     * Whether or not the member is streaming their camera.
     */
    videoEnabled: boolean = false;

    /**
     * A VoiceState represents a voice state in any channel
     * on Discord.
     * 
     * @param {Client} client The client this voice state belongs to.
     * @param {any} data The data of the voice state.
     */
    constructor (client: Client, channel: VoiceChannel, data: any) {
        this.client = client;
        this.channel = channel;
        this.guild = channel.guild;
        this.build(data);
    }

    /**
     * Build the voice state from the data.
     * 
     * @param {any} data The data of the voice state.
     * @returns {VoiceState} The voice state.
     */
    private build (data: any): VoiceState {
        this.memberId = data.user_id;
        let member: GuildMember | null = this.guild.members.cache.get(data.user_id);
        if (!member) {
            this.member = this.guild.members.resolve(data.user_id, data.member ?? undefined);
        } else {
            this.member = member;
        }

        if ('session_id' in data) {
            this.sessionId = data.session_id;
        }
        if ('deaf' in data) {
            this.deaf = data.deaf;
        }
        if ('mute' in data) {
            this.mute = data.mute;
        }
        if ('self_deaf' in data) {
            this.selfDeaf = data.self_deaf;
        }
        if ('self_mute' in data) {
            this.selfMute = data.self_mute;
        }
        if ('self_stream' in data) {
            this.streaming = data.self_stream;
        }
        if ('self_video' in data) {
            this.videoEnabled = data.self_video;
        }

        return this;
    }

    /**
     * Fetch the member from the Discord API.
     * 
     * @returns {Promise<VoiceState>} The updated voice state.
     */
    async fetch (): Promise<VoiceState> {
        this.member ??= await this.guild.members.fetch(this.memberId);
        return this;
    }

    /**
     * Set the voice state to the cache.
     * 
     * @returns {VoiceState} The voice state.
     */
    private set (): VoiceState {
        this.guild?.channels.cache.get(this.channel.id)?.states?.cache.set(this.member?.id, this);
        return this;
    }

}
