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
import BaseUser from './BaseUser';
import GuildMemberRoleBlock from './blocks/GuildMemberRoleBlock';
import Client from './Client';
import { HTTPGuild } from '..';
import OptionError from '../errors/OptionError';

export default class GuildMember {

    client: Client = null!;
    readonly id: string;
    guild: Guild = null!;
    user: BaseUser | null = null;
    originalUser: any = null;
    full: boolean = false;
    nick: string | null = null;
    avatar: string | null = null;
    joinedAt: Date | null = null;
    deafened: boolean = false;
    muted: boolean = false;
    timedOutUntil: Date | null = null;
    pendingMembershipScreening: boolean = false;
    roles: GuildMemberRoleBlock = null!;

    constructor (client: Client, data: any, guild: Guild) {
        this.client = client;
        this.id = data.user.id;
        this.guild = guild;
        this.build(data);
    }

    private build (data: any) {
        this.roles = new GuildMemberRoleBlock(this.client);
        if (data.roles) {
            for ( let i = 0; i < data.roles.length; i++ ) {
                this.roles.cache.set(data.roles[i], this.guild.roles.cache.get(data.roles[i]));
            }
        }

        if ('user' in data) {
            this.originalUser = data.user;
            this.user = this.client.users.resolve(data.user.id, data.user) || null;
        }
        if ('nick' in data) {
            this.nick = data.nick;
        }
        if ('avatar' in data) {
            this.avatar = data.avatar;
        }
        if ('joined_at' in data) {
            this.joinedAt = new Date(data.joined_at);
        }
        if ('deaf' in data) {
            this.deafened = data.deaf;
        }
        if ('mute' in data) {
            this.muted = data.mute;
        }
        if ('communication_disabled_until' in data) {
            if (data.communication_disabled_until > new Date()) {
                this.timedOutUntil = new Date(data.communication_disabled_until);
            }
        }
        if ('pending' in data) {
            this.pendingMembershipScreening = data.pending;
        }
    }

    /**
     * Check if this GuildMember is in timeout.
     * 
     * @returns {boolean} Whether this GuildMember is in timeout.
     */
    isInTimeout (): boolean {
        return this.timedOutUntil !== null && this.timedOutUntil > new Date();
    }

    /**
     * Set this GuildMember's muted status.
     * 
     * @param {boolean} deafen The new muted status.
     * @param {String} [reason] The reason for modifying this GuildMember.
     * @returns {Promise<void>} A Promise that voids when the GuildMember has been changed.
     */
    async setMute (mute: boolean, reason?: string): Promise<void> {
        await this.modify({
            mute: mute,
        }, reason);
    }

    /**
     * Set this GuildMember's deafened status.
     * 
     * @param {boolean} deafen The new deafened status.
     * @param {String} [reason] The reason for modifying this GuildMember.
     * @returns {Promise<void>} A Promise that voids when the GuildMember has been changed.
     */
    async setDeafen (deafen: boolean, reason?: string): Promise<void> {
        await this.modify({
            deaf: deafen,
        }, reason);
    }

    /**
     * Set this GuildMember's nickname.
     * 
     * @param {number} nickname The new nickname.
     * @param {String} [reason] The reason for modifying this GuildMember.
     * @returns {Promise<void>} A Promise that voids when the GuildMember has been changed.
     */
    async setNick (nickname: string, reason?: string): Promise<void> {
        await this.modify({
            nick: nickname,
        }, reason);
    }

    /**
     * Kick the GuildMember.
     * 
     * @param {String} [reason] The reason for kicking this GuildMember.
     * @returns {Promise<void>} A Promise that voids when the GuildMember has been changed.
     */
    async kick (reason?: string): Promise<void> {
        await HTTPGuild.removeMember(this.client, this.guild.id, this.id, reason);
    }

    /**
     * Ban the GuildMember.
     * 
     * @param {number} [daysToPrune=0] The amount of days of messages to prune.
     * @param {String} [reason] The reason for banning this GuildMember.
     * @returns {Promise<void>} A Promise that voids when the GuildMember has been changed.
     */
    async ban (daysToPrune: number, reason?: string): Promise<void> {
        await HTTPGuild.createBan(this.client, this.guild.id, this.id, {
            delete_message_days: daysToPrune || 0,
        }, reason);
    }

    /**
     * Modify the GuildMember.
     * 
     * @param {Object} data The data to send to the Discord API.
     * @param {String} [reason] The reason for modifying this GuildMember.
     * @returns {Promise<void>} A Promise that voids when the GuildMember has been changed.
     */
    async modify (data: Object, reason?: string): Promise<void> {
        if (data === undefined) {
            throw new OptionError('data [at 0] must be provided');
        }
        await HTTPGuild.modifyMember(this.client, this.guild.id, this.id, data, reason);
    }

    async _waitForFull (): Promise<GuildMember> {
        if (this.full) {
            return this;
        }
        if (this.client.me && this.originalUser.id === this.client.me.id) {
            this.user = this.client.me;
        } else {
            this.user = await this.client.users.fetch(this.originalUser.id);
        }
        this.full = true;
        return this;
    }

    private set (): GuildMember {
        this.guild.members.cache.set(this.id, this);
        return this;
    }

}
