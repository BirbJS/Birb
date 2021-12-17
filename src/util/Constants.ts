/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


/* 
 *  API Constants
 *  These will be used for API connections
 */


// Client Intents

export enum Intents {
    GUILDS = (1 << 0),
    GUILD_MEMBERS = (1 << 1),
    GUILD_BANS = (1 << 2),
    GUILD_EMOJIS_AND_STICKERS = (1 << 3),
    GUILD_INTEGRATIONS = (1 << 4),
    GUILD_WEBHOOKS = (1 << 5),
    GUILD_INVITES = (1 << 6),
    GUILD_VOICE_STATES = (1 << 7),
    GUILD_PRESENCES = (1 << 8),
    GUILD_MESSAGES = (1 << 9),
    GUILD_MESSAGE_REACTIONS = (1 << 10),
    GUILD_MESSAGE_TYPING = (1 << 11),
    DIRECT_MESSAGES = (1 << 12),
    DIRECT_MESSAGE_REACTIONS = (1 << 13),
    DIRECT_MESSAGE_TYPING = (1 << 14),
    GUILD_SCHEDULED_EVENTS = (1 << 16),
    NOT_PRIVILEGED = 98045,
    ALL = 98303,
}


// Gateway

export enum Status {
    IDLE = 0,
    READY = 1,
    CONNECTING = 2,
    RECONNECTING = 3,
    DISCONNECTED = 4,
    WAITING_FOR_GUILDS = 5,
    RESUMING = 6,
    IDENTIFYING = 7,
}

export enum PacketOperation {
    DISPATCH = 0,
    HEARTBEAT = 1,
    IDENTIFY = 2,
    PRESENCE_UPDATE = 3,
    VOICE_STATE_UPDATE = 4,
    VOICE_SERVER_PING = 5,
    RESUME = 6,
    RECONNECT = 7,
    REQUEST_GUILD_MEMBERS = 8,
    INVALID_SESSION = 9,
    HELLO = 10,
    HEARTBEAT_ACK = 11,
}

export enum GatewayCloseCode {
    UNKNOWN_ERROR = 4000,
    UNKNOWN_OPCODE = 4001,
    DECODE_ERROR = 4002,
    NOT_AUTHENTICATED = 4003,
    AUTHENTICATION_FAILED = 4004,
    ALREADY_AUTHENTICATED = 4005,
    INVALID_SEQ = 4007,
    RATE_LIMITED = 4008,
    SESSION_TIMEOUT = 4009,
    INVALID_SHARD = 4010,
    SHARDING_REQUIRED = 4011,
    INVALID_VERSION = 4012,
    INVALID_INTENTS = 4013,
    DISALLOWED_INTENTS = 4014,
}

/*
 *  Data Constants
 *  Constants for data types that the API sent
 */


// Channel

export enum ChannelTypes {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE	= 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_NEWS = 5,
    GUILD_STORE	= 6,
    GUILD_NEWS_THREAD = 10,
    GUILD_PUBLIC_THREAD	= 11,
    GUILD_PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
}

export enum SystemChannelFlags {
    SUPPRESS_JOIN_NOTIFICATIONS	= (1 << 0),
    SUPPRESS_PREMIUM_SUBSCRIPTIONS	= (1 << 1),
    SUPPRESS_GUILD_REMINDER_NOTIFICATIONS	= (1 << 2),
    SUPPRESS_JOIN_NOTIFICATION_REPLIES	= (1 << 3),
}


// Guild

// Guild Settings Level

export enum NotificationLevel {
    ALL_MESSAGES = 0,
    ONLY_MENTIONS = 1,
}

export enum VerificationLevel {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    VERY_HIGH = 4,
}

export enum MFALevel {
    NONE = 0,
    ELEVATED = 1,
}

export enum ExplicitContentFilterLevel {
    DISABLED = 0,
    MEMBERS_WITHOUT_ROLES = 1,
    ALL_MEMBERS = 2,
}

export enum NSFWLevel {
    UNKNOWN = 0,
    EXPLICIT = 1,
    SAFE = 2,
    AGE_RESTRICTED = 3,
}

// Guild Boost Level

export enum PremiumTier {
    NONE = 0,
    TIER_1 = 1,
    TIER_2 = 2,
    TIER_3 = 3,
}

// Guild Events

export enum GuildScheduledEventsPrivacyLevel {
    GUILD_ONLY = 2,
}

export enum GuildScheduledEventsEntityTypes {
    STAGE_INSTANCE = 1,
    VOICE = 2,
    EXTERNAL = 3,
}

// Guild Invite

export enum InviteTargetTypes {
    STREAM = 1,
    EMBEDDED_APPLICATION = 2,
}

// Guild Stage

export enum StageInstancePrivacyLevel {
    PUBLIC = 1,
    GUILD_ONLY = 2,
}


// Presence

export enum ActivityType {
    PLAYING = 0,
    STREAMING = 1,
    LISTENING = 2,
    WATCHING = 3,
    CUSTOM = 4,
    COMPETING = 5,
}


// Message

export enum MessageTypes {
    DEFAULT = 0,
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_ICON_CHANGE = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    GUILD_MEMBER_JOIN = 7,
    USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
    CHANNEL_FOLLOW_ADD = 12,
    GUILD_DISCOVERY_DISQUALIFIED = 14,
    GUILD_DISCOVERY_REQUALIFIED = 15,
    GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
    GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
    THREAD_CREATED = 18,
    REPLY = 19,
    CHAT_INPUT_COMMAND = 20,
    THREAD_STARTER_MESSAGE	= 21,
    GUILD_INVITE_REMINDER = 22,
    CONTEXT_MENU_COMMAND = 23,
}

export enum SystemMessageTypes {
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_ICON_CHANGE = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    GUILD_MEMBER_JOIN = 7,
    USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
    USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
    CHANNEL_FOLLOW_ADD = 12,
    GUILD_DISCOVERY_DISQUALIFIED = 14,
    GUILD_DISCOVERY_REQUALIFIED = 15,
    GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
    GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
    THREAD_CREATED = 18,
    THREAD_STARTER_MESSAGE	= 21,
    GUILD_INVITE_REMINDER = 22,
}

export enum MessageFlags {
    CROSSPOSTED = (1 << 0),
    IS_CROSSPOST = (1 << 1),
    SUPPRESS_EMBEDS = (1 << 2),
    SOURCE_MESSAGE_DELETED = (1 << 3),
    URGENT = (1 << 4),
    HAS_THREAD = (1 << 5),
    EPHEMERAL = (1 << 6),
    LOADING = (1 << 7),
}


// Sticker

export enum StickerTypes {
    STANDARD = 1,
    GUILD = 2,
}

export enum StickerFormatTypes {
    PNG = 1,
    APNG = 2,
    LOTTIE = 3,
}


// User

export enum UserFlags {
	None = 0,
	STAFF = (1 << 0),
	PARTNER = (1 << 1),
	HYPESQUAD = (1 << 2),
	BUG_HUNTER_LEVEL_1 = (1 << 3),
	HYPESQUAD_ONLINE_HOUSE_1 = (1 << 6),
	HYPESQUAD_ONLINE_HOUSE_2 = (1 << 7),
	HYPESQUAD_ONLINE_HOUSE_3 = (1 << 8),
	PREMIUM_EARLY_SUPPORTER	 = (1 << 9),
	TEAM_PSEUDO_USER = (1 << 10),
	BUG_HUNTER_LEVEL_2 = (1 << 14),
	VERIFIED_BOT = (1 << 16),
	VERIFIED_DEVELOPER = (1 << 17),
	CERTIFIED_MODERATOR = (1 << 18),
	BOT_HTTP_INTERACTIONS = (1 << 19),
}

export enum VisibilityTypes {
    None = 0,
    Everyone = 1,
}


// Webhook

export enum WebhookTypes {
    "Incoming" = 1,
    "Channel Follower" = 2,
    "Application" = 3,
}