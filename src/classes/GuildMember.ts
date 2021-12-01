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
        this._build(data);
    }

    _build (data: any) {
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

    isInTimeout (): boolean {
        return this.timedOutUntil !== null && this.timedOutUntil > new Date();
    }

    async edit (data: {
        nick?: string,
        mute?: boolean,
        deaf?: boolean,
        communication_disabled_until?: string | null,
    }, reason?: string): Promise<void> {
        await HTTPGuild.modifyMember(this.client, this.guild.id, this.id, data, reason);
    }

    async setMute (mute: boolean, reason?: string): Promise<void> {
        await this.edit({
            mute: mute,
        }, reason);
    }

    async setDeafen (deafen: boolean, reason?: string): Promise<void> {
        await this.edit({
            deaf: deafen,
        }, reason);
    }

    async setNick (nickname: string, reason?: string): Promise<void> {
        await this.edit({
            nick: nickname,
        }, reason);
    }

    async timeout (expires: Date | null, reason?: string): Promise<void> {
        let set: string | null = null;
        if (expires) {
            if (expires < new Date()) {
                throw new OptionError('the expiry date must be in the future');
            }
            if (expires.getTime() - new Date().getTime() > 60000 * 60 * 24 * 24) {
                throw new OptionError('the expiry date must be within 24 days');
            }
            set = expires.toISOString().slice(0, -2);
        }

        await this.edit({
            communication_disabled_until: set,
        }, reason);
    }

    async clearTimeout (reason?: string): Promise<void> {
        await this.timeout(null, reason);
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

    _set (): GuildMember {
        this.guild.members.cache.set(this.id, this);
        return this;
    }

}
