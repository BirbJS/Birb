/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import GuildError from "../errors/GuildError";
import { NSFWLevel, MFALevel, NotificationLevel, VerificationLevel, ExplicitContentFilterLevel } from "../util/Constants";
import Client from "./Client";
import Role from "./Role";

export default class Guild {
    
    client: Client = null!;
    id: string = null!;
    name: string | null = null;
    icon: string | null = null;
    nsfw: boolean = false;
    discoverySplash: string | null = null;
    banner: string | null = null;
    description: string | null = null;
    verificationLevel: VerificationLevel | null = null;
    defaultNotifications: NotificationLevel | null = null;
    available: boolean = true;
    systemChannelId: string | null = null;
    ownerId: string | null = null;
    large: boolean = false;
    afkChannelId: string | null = null;
    explicitContentFilter: ExplicitContentFilterLevel | null = null;
    maxMembers: number | null = null;
    preferredLocale: string | null = null;
    mfaLevel: MFALevel | null = null;
    vanityCode: string | null = null;
    nsfwLevel: NSFWLevel | null = null;
    maxVideoChannelUsers: number | null = null;
    boosterCount: number | null = null;
    splash: string | null = null;
    memberCount: number | null = null;
    boostTier: number | null = null;
    rulesChannelId: string | null = null;
    afkTimeout: number | null = null;
    roles: Role[] = [];

    constructor (client: Client, data: any) {
        if (typeof data.id !== 'string') {
            throw new GuildError('invalid guild data provided');
        }
        this.client = client;
        this.id = data.id;
        this._build(data);
    }

    _build (data: any): void {
        if ('name' in data) {
            this.name = data.name;
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
        if ('verification_level' in data) {
            this.verificationLevel = data.verification_level;
        }
        if ('unavailable' in data) {
            this.available = !data.unavailable;
        }
        if ('system_channel_id' in data) {
            this.systemChannelId = data.system_channel_id;
        }
        if ('owner_id' in data) {
            this.ownerId = data.owner_id;
        }
        if ('large' in data) {
            this.large = data.large;
        }
        if ('afk_channel_id' in data) {
            this.afkChannelId = data.afk_channel_id;
        }
        if ('explicit_content_filter' in data) {
            this.explicitContentFilter = data.explicit_content_filter;
        }
        if ('max_members' in data) {
            this.maxMembers = data.max_members;
        }
        if ('preferred_locale' in data) {
            this.preferredLocale = data.preferred_locale;
        }
        if ('mfa_level' in data) {
            this.mfaLevel = data.mfa_level;
        }
        if ('system_channel_flags' in data) {
            this.systemChannelId = data.system_channel_flags;
        }
        if ('vanity_url_code' in data) {
            this.vanityCode = data.vanity_url_code;
        }
        if ('nsfw_level' in data) {
            this.nsfwLevel = data.nsfw_level;
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
        if ('premium_tier' in data) {
            this.boostTier = data.premium_tier;
        }
        if ('rules_channel_id' in data) {
            this.rulesChannelId = data.rules_channel_id;
        }
        if ('afk_timeout' in data) {
            this.afkTimeout = data.afk_timeout;
        }
        if ('roles' in data) {
            this.roles = data.roles.map((r: any) => new Role(this.client, r));
        }
    }

}
