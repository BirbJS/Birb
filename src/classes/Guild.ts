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
import { ChannelResolvable } from '../util/Types';
import Validator from '../util/Validator';
import HTTPUser from './http/HTTPUser';

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
        this.build(data);
    }

    private build (data: any): void {
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
        if (name === undefined) {
            throw new OptionError('name [at 0] must be provided');
        }
        if (typeof name !== 'string') {
            throw new OptionError('name [at 0] must be a string with a length of at least 1 character');
        }
        await HTTPGuild.modify(this.client, this.id, { name }, reason);
    }

    /**
     * Change this Guild's verification level.
     * 
     * @param {VerificationLevel} level The new verification level for the Guild.
     * @param {String} [reason] The reason for modifying this Guild.
     * @returns {Promise<void>} A Promise that voids when the Guild has been changed.
     * @public
     */
    async setVerificationLevel (level: VerificationLevel, reason?: string): Promise<void> {
        if (level === undefined) {
            throw new OptionError('level [at 0] must be provided');
        }
        if (level < 0 || level > 4) {
            throw new OptionError('level [at 0] must be a valid VerificationLevel');
        }
        await HTTPGuild.modify(this.client, this.id, { verification_level: level }, reason);
    }

    /**
     * Change this Guild's default notifications level.
     * 
     * @param {NotificationLevel} level The new notification level for the Guild.
     * @param {String} [reason] The reason for modifying this Guild.
     * @returns {Promise<void>} A Promise that voids when the Guild has been changed.
     * @public
     */
    async setDefaultNotifications (level: NotificationLevel, reason?: string): Promise<void> {
        if (level === undefined) {
            throw new OptionError('level [at 0] must be provided');
        }
        if (level < 0 || level > 1) {
            throw new OptionError('level [at 0] must be a valid NotificationLevel');
        }
        await HTTPGuild.modify(this.client, this.id, { default_message_notifications: level }, reason);
    }

    /**
     * Change this Guild's explicit content filter level.
     * 
     * @param {ExplicitContentFilterLevel} level The new explicit content filter level for the Guild.
     * @param {String} [reason] The reason for modifying this Guild.
     * @returns {Promise<void>} A Promise that voids when the Guild has been changed.
     * @public
     */
    async setExplicitContentFilter (level: ExplicitContentFilterLevel, reason?: string): Promise<void> {
        if (level === undefined) {
            throw new OptionError('level [at 0] must be provided');
        }
        if (level < 0 || level > 1) {
            throw new OptionError('level [at 0] must be a valid ExplicitContentFilterLevel');
        }
        await HTTPGuild.modify(this.client, this.id, { explicit_content_filter: level }, reason);
    }

    /**
     * Set this Guild's AFK timeout channel.
     * 
     * @param {ChannelResolvable} channel The AFK timeout channel.
     * @param {String} [reason] The reason for modifying this Guild.
     * @returns {Promise<void>} A Promise that voids when the Guild has been changed.
     * @public
     */
    async setAfkChannel (channel: ChannelResolvable, reason?: string): Promise<void> {
        if (channel === undefined) {
            throw new OptionError('channel [at 0] must be provided');
        }
        channel = Validator.parseChannel(channel);
        await HTTPGuild.modify(this.client, this.id, { afk_channel_id: channel }, reason);
    }

    /**
     * Change this Guild's AFK timeout.
     * 
     * @param {number} seconds The AFK timeout in seconds.
     * @param {String} [reason] The reason for modifying this Guild.
     * @returns {Promise<void>} A Promise that voids when the Guild has been changed.
     * @public
     */
    async setAfkTimeout (seconds: number, reason?: string): Promise<void> {
        if (seconds === undefined) {
            throw new OptionError('seconds [at 0] must be provided');
        }
        await HTTPGuild.modify(this.client, this.id, { afk_timeout: seconds }, reason);
    }

    /**
     * Set this Guild's system messages channel.
     * 
     * @param {ChannelResolvable} channel The channel.
     * @param {String} [reason] The reason for modifying this Guild.
     * @returns {Promise<void>} A Promise that voids when the Guild has been changed.
     * @public
     */
    async setSystemChannel (channel: ChannelResolvable, reason?: string): Promise<void> {
        if (channel === undefined) {
            throw new OptionError('channel [at 0] must be provided');
        }
        channel = Validator.parseChannel(channel);
        await HTTPGuild.modify(this.client, this.id, { system_channel_id: channel }, reason);
    }

    /**
     * Set this Guild's rules channel.
     * 
     * @param {ChannelResolvable} channel The channel.
     * @param {String} [reason] The reason for modifying this Guild.
     * @returns {Promise<void>} A Promise that voids when the Guild has been changed.
     * @public
     */
    async setRulesChannel (channel: ChannelResolvable, reason?: string): Promise<void> {
        if (channel === undefined) {
            throw new OptionError('channel [at 0] must be provided');
        }
        channel = Validator.parseChannel(channel);
        await HTTPGuild.modify(this.client, this.id, { rules_channel_id: channel }, reason);
    }

    /**
     * Set this Guild's public updates channel.
     * 
     * @param {ChannelResolvable} channel The channel.
     * @param {String} [reason] The reason for modifying this Guild.
     * @returns {Promise<void>} A Promise that voids when the Guild has been changed.
     * @public
     */
    async setPublicUpdatesChannel (channel: ChannelResolvable, reason?: string): Promise<void> {
        if (channel === undefined) {
            throw new OptionError('channel [at 0] must be provided');
        }
        channel = Validator.parseChannel(channel);
        await HTTPGuild.modify(this.client, this.id, { public_updates_channel_id: channel }, reason);
    }

    /**
     * Set the Guild's preferred locale.
     * 
     * @param {String} locale The new locale.
     * @param {String} [reason] The reason for modifying this Guild.
     * @returns {Promise<void>} A Promise that voids when the Guild has been changed.
     * @public
     */
    async setPreferredLocale (locale: string, reason?: string): Promise<void> {
        if (locale === undefined) {
            throw new OptionError('locale [at 0] must be provided');
        }
        await HTTPGuild.modify(this.client, this.id, { preferred_locale: locale }, reason);
    }

    /**
     * Set the Guild's description.
     * 
     * @param {String} description The new description.
     * @param {String} [reason] The reason for modifying this Guild.
     * @returns {Promise<void>} A Promise that voids when the Guild has been changed.
     * @public
     */
    async setDescription (description: string, reason?: string): Promise<void> {
        if (description === undefined) {
            throw new OptionError('description [at 0] must be provided');
        }
        await HTTPGuild.modify(this.client, this.id, { description }, reason);
    }

    /**
     * Toggle the Guild's booster progress bar.
     * 
     * @param {boolean} toggle Whether or not to show the booster progress bar.
     * @param {String} [reason] The reason for modifying this Guild.
     * @returns {Promise<void>} A Promise that voids when the Guild has been changed.
     * @public
     */
    async setBoostProgressBar (toggle: number, reason?: string): Promise<void> {
        if (toggle === undefined) {
            throw new OptionError('toggle [at 0] must be provided');
        }
        await HTTPGuild.modify(this.client, this.id, { premium_progress_bar_enabled: toggle }, reason);
    }

    /**
     * Modify the Guild.
     * 
     * @param {Object} data The data to send to the Discord API.
     * @param {String} [reason] The reason for modifying this Guild.
     * @returns {Promise<void>} A Promise that voids when the Guild has been changed.
     */
    async modify (data: Object, reason?: string): Promise<void> {
        if (data === undefined) {
            throw new OptionError('data [at 0] must be provided');
        }
        await HTTPGuild.modify(this.client, this.id, data, reason);
    }

    /**
     * Leave the Guild.
     * 
     * @returns {Promise<void>} A Promise that voids when the Guild has been left.
     */
    async leave (): Promise<void> {
        await HTTPUser.leaveGuild(this.client, this.id);
    }

    /**
     * Set the Guild's data to the cache.
     * 
     * @returns {Guild} This Guild instance.
     * @public
     */
    private set (): Guild {
        this.client.guilds.cache.set(this.id, this);
        return this;
    }

}
