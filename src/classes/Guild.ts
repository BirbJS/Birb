/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import HTTPGuild from './http/HTTPGuild';
import GuildError from '../errors/GuildError';
import OptionError from '../errors/OptionError';
import { NSFWLevel, MFALevel, NotificationLevel, VerificationLevel, ExplicitContentFilterLevel } from '../util/Constants';
import ChannelBlock from './blocks/ChannelBlock';
import RoleBlock from './blocks/RoleBlock';
import Client from './Client';
import Role from './Role';
import TextChannel from './TextChannel';
import GuildMemberBlock from './blocks/GuildMemberBlock';
import GuildMember from './GuildMember';

export default class Guild {
    
    client: Client = null!;
    readonly id: string;
    name: string = null!;
    icon: string | null = null;
    nsfw: boolean = false;
    discoverySplash: string | null = null;
    banner: string | null = null;
    description: string | null = null;
    verificationLevel: VerificationLevel = null!;
    defaultNotifications: NotificationLevel = null!;
    available: boolean = false;
    systemChannelId: string | null = null;
    ownerId: string = null!;
    large: boolean = false;
    afkChannelId: string | null = null;
    explicitContentFilter: ExplicitContentFilterLevel = null!;
    maxMembers: number | null = null;
    preferredLocale: string | null = null;
    mfaLevel: MFALevel = null!;
    vanityCode: string | null = null;
    nsfwLevel: NSFWLevel = null!;
    maxVideoChannelUsers: number | null = null;
    approximateMemberCount: number | null = null;
    approximatePresenceCount: number | null = null;
    boosterCount: number | null = null;
    splash: string | null = null;
    memberCount: number | null = null;
    boostTier: number = null!;
    rulesChannelId: string | null = null;
    afkTimeout: number = null!;
    roles: RoleBlock = null!;
    channels: ChannelBlock = null!;
    members: GuildMemberBlock = null!;

    constructor (client: Client, data: any) {
        if (typeof data.id !== 'string') {
            throw new GuildError('invalid guild data provided');
        }
        this.client = client;
        this.id = data.id;
        this._build(data);
    }

    _build (data: any): void {
        this.name = data.name;
        this.verificationLevel = data.verification_level;
        this.defaultNotifications = data.default_message_notifications;
        this.available = data.available ?? false;
        this.ownerId = data.owner_id;
        this.explicitContentFilter = data.explicit_content_filter;
        this.mfaLevel = data.mfa_level;
        this.nsfwLevel = data.nsfw_level;
        this.boostTier = data.premium_tier;
        this.afkTimeout = data.afk_timeout;

        this.roles = new RoleBlock(this.client);
        for ( let i = 0; i < data.roles.length; i++ ) {
            this.roles.cache.set(data.roles[i].id, new Role(this.client, data.roles[i], this));
        }

        this.channels = new ChannelBlock(this.client);
        for ( let i = 0; i < data.channels.length; i++ ) {
            switch (data.channels[i].type) {
                case 0:
                    this.channels.cache.set(data.channels[i].id, new TextChannel(this.client, data.channels[i], {
                        maxSize: 100,
                        maxAge: 300,
                    }));
                    break;
            }
        }

        this.members = new GuildMemberBlock(this.client, this);
        for ( let i = 0; i < data.members.length; i++ ) {
            this.members.cache.set(data.members[i].id, new GuildMember(this.client, data.members[i], this));
        }

        if ('icon' in data) {
            this.icon = data.icon;
        }
        if ('nsfw' in data) {
            this.nsfw = data.nsfw;
        }
        if ('discovery_splash' in data) {
            this.discoverySplash = data.discovery_splash;
        }
        if ('banner' in data) {
            this.banner = data.banner;
        }
        if ('description' in data) {
            this.description = data.description;
        }
        if ('system_channel_id' in data) {
            this.systemChannelId = data.system_channel_id;
        }
        if ('large' in data) {
            this.large = data.large;
        }
        if ('afk_channel_id' in data) {
            this.afkChannelId = data.afk_channel_id;
        }
        if ('max_members' in data) {
            this.maxMembers = data.max_members;
        }
        if ('preferred_locale' in data) {
            this.preferredLocale = data.preferred_locale;
        }
        if ('system_channel_flags' in data) {
            this.systemChannelId = data.system_channel_flags;
        }
        if ('vanity_url_code' in data) {
            this.vanityCode = data.vanity_url_code;
        }
        if ('max_video_channel_users' in data) {
            this.maxVideoChannelUsers = data.max_video_channel_users;
        }
        if ('premium_subscription_count' in data) {
            this.boosterCount = data.premium_subscription_count;
        }
        if ('member_count' in data) {
            this.memberCount = data.member_count;
        }
        if ('splash' in data) {
            this.splash = data.splash;
        }
        if ('rules_channel_id' in data) {
            this.rulesChannelId = data.rules_channel_id;
        }
    }

    /**
     * Change this Guild's name.
     * 
     * @param {String} name The new name for the Guild.
     * @param {String} [reason] The reason for changing the Guild's name.
     * @returns {Promise<void>} A Promise that voids when the Guild's name has been changed.
     * @public
     */
    async setName (name: string, reason?: string): Promise<void> {
        if (!this.name) {
            throw new OptionError('name [at 0] must be provided');
        }
        if (typeof name !== 'string') {
            throw new OptionError('name [at 0] must be a string with a length of at least 1 character');
        }
        await HTTPGuild.modify(this.client, this.id, { name }, reason);
    }

    /**
     * Set the Guild's data to the cache.
     * 
     * @returns {Guild} This Guild instance.
     * @public
     */
    _set (): Guild {
        this.client.guilds.cache.set(this.id, this);
        return this;
    }

}
