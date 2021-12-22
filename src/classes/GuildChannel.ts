/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Channel from './Channel';
import Guild from './Guild';
import Client from './Client';
import ChannelPermissionsBlock from './blocks/ChannelPermissionsBlock';

export default abstract class GuildChannel extends Channel {

    /**
     * The guild this channel belongs to.
     */
    guild: Guild = null!;
    /**
     * The permission overwrites associated with this
     * channel.
     */
    permissions: ChannelPermissionsBlock = null!;

    /**
     * A GuildChannel represents any channel on Discord
     * that is associated with a guild.
     * 
     * @param {Client} client The client this channel belongs to.
     * @param {any} data The data of this channel.
     * @param {Guild} [guild] The guild this channel belongs to.
     */
    constructor (client: Client, data: any, guild?: Guild) {
        super(client, data);
        this.guild = guild ?? client.guilds.cache.get(data.guild_id);
        this.permissions = new ChannelPermissionsBlock(client, this, data.permission_overwrites);
    }

    /**
     * Set the name of this channel.
     * 
     * @param {string} name The name of this channel.
     * @param {string} [reason] The reason for changing the name.
     * @returns {Promise<GuildChannel>} This channel.
     */
    setName (name: string, reason?: string): Promise<GuildChannel> {
        return this.modify({ name }, reason);
    }

    /**
     * Set the position of this channel.
     * 
     * @param {number} position The position of this channel.
     * @param {string} [reason] The reason for changing the position.
     * @returns {Promise<GuildChannel>} This channel.
     */
    setPosition (position: number, reason?: string): Promise<GuildChannel> {
        return this.modify({ position }, reason);
    }

    /**
     * Set the overwrites of this channel.
     * 
     * @param {{ id: string, type: 'role' | 'member' }[]} overwrites The overwrites to set.
     */
    protected async setOverwrites (overwrite: {
        id: string,
        type: 'role' | 'member',
    }[]): Promise<void> {
        
    }

    /**
     * Send a raw API request to modify this channel
     * 
     * @param {any} data The data to send.
     * @param {string} [reason] The reason for this action.
     */
    abstract modify (data: any, reason?: string): Promise<GuildChannel>;

}
