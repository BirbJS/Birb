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



/**
 * The available Intents.
 */
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



/**
 * The possible websocket states.
 */
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



/**
 * The possible gateway opcodes.
 */
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



/**
 * The possible gateway close codes.
 */
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



/**
 * The possible channel types.
 */
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



/**
 * The possible system channel flags.
 */
export enum SystemChannelFlags {
    SUPPRESS_JOIN_NOTIFICATIONS	= (1 << 0),
    SUPPRESS_PREMIUM_SUBSCRIPTIONS	= (1 << 1),
    SUPPRESS_GUILD_REMINDER_NOTIFICATIONS	= (1 << 2),
    SUPPRESS_JOIN_NOTIFICATION_REPLIES	= (1 << 3),
}


// Guild



/**
 * The possible notification levels.
 */
export enum NotificationLevel {
    ALL_MESSAGES = 0,
    ONLY_MENTIONS = 1,
}



/**
 * The possible verification levels.
 */
export enum VerificationLevel {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    VERY_HIGH = 4,
}



/**
 * The possible MFA requirement levels.
 */
export enum MFALevel {
    NONE = 0,
    ELEVATED = 1,
}



/**
 * The possible explicit content filter levels.
 */
export enum ExplicitContentFilterLevel {
    DISABLED = 0,
    MEMBERS_WITHOUT_ROLES = 1,
    ALL_MEMBERS = 2,
}



/**
 * The possible NSFW levels.
 */
export enum NSFWLevel {
    UNKNOWN = 0,
    EXPLICIT = 1,
    SAFE = 2,
    AGE_RESTRICTED = 3,
}



/**
 * The possible guild boost levels.
 */
export enum PremiumTier {
    NONE = 0,
    TIER_1 = 1,
    TIER_2 = 2,
    TIER_3 = 3,
}



/**
 * The possible guild event privacy levels.
 */
export enum GuildScheduledEventsPrivacyLevel {
    GUILD_ONLY = 2,
}



/**
 * The possible guild event entity types.
 */
export enum GuildScheduledEventsEntityTypes {
    STAGE_INSTANCE = 1,
    VOICE = 2,
    EXTERNAL = 3,
}



/**
 * The possible invite types.
 */
export enum InviteTargetTypes {
    STREAM = 1,
    EMBEDDED_APPLICATION = 2,
}



/**
 * The possible stage privacy levels.
 */
export enum StageInstancePrivacyLevel {
    PUBLIC = 1,
    GUILD_ONLY = 2,
}



/**
 * The possible activity types.
 */
export enum ActivityType {
    PLAYING = 0,
    STREAMING = 1,
    LISTENING = 2,
    WATCHING = 3,
    CUSTOM = 4,
    COMPETING = 5,
}



/**
 * The possible message types.
 */
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



/**
 * The possible system message types.
 */
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



/**
 * The possible message flags.
 */
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



/**
 * The possible sticker types.
 */
export enum StickerTypes {
    STANDARD = 1,
    GUILD = 2,
}



/**
 * The possible sticker formats.
 */
export enum StickerFormatTypes {
    PNG = 1,
    APNG = 2,
    LOTTIE = 3,
}



/**
 * The possible user flags.
 */
export enum UserFlags {
    None = 0,
    DISCORD_EMPLOYEE = (1 << 0),
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



/**
 * The possible user visibility types.
 */
export enum VisibilityTypes {
    NONE = 0,
    EVERYONE = 1,
}



/**
 * The possible webhook types.
 */
export enum WebhookTypes {
    INCOMING = 1,
    CHANNEL_FOLLOWER = 2,
    APPLICATION = 3,
}



export enum Permissions {
    /**
     * Create new invite links.
     */
    CREATE_INSTANT_INVITE = (1 << 0),
    /**
     * Kick other members.
     */
    KICK_MEMBERS = (1 << 1),
    /**
     * Ban other members.
     */
    BAN_MEMBERS = (1 << 2),
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
    ADMINISTRATOR = (1 << 3),
    /**
     * Manage channels in this guild.
     */
    MANAGE_CHANNELS = (1 << 4),
    /**
     * Manage the guild's settings.
     */
    MANAGE_GUILD = (1 << 5),
    /**
     * Add reactions to messages. Users without this
     * permission will still be able to react to 
     * already-added reactions.
     */
    ADD_REACTIONS = (1 << 6),
    /**
     * View the guild's audit log.
     */
    VIEW_AUDIT_LOG = (1 << 7),
    /**
     * Grants the ability to speak in priority mode.
     * Whilst a member is speaking in priority mode,
     * everyone else's volume is decreased until the
     * priority member stops speaking.
     */
    PRIORITY_SPEAKER = (1 << 8),
    /**
     * Stream games and video to the channel.
     */
    STREAM = (1 << 9),
    /**
     * View the guild's channels.
     */
    VIEW_CHANNEL = (1 << 10),
    /**
     * Send messages in the guild's channels.
     */
    SEND_MESSAGES = (1 << 11),
    /**
     * Send text-to-speach messages in the guild's
     * channels.
     */
    SEND_TTS_MESSAGES = (1 << 12),
    /**
     * Delete and/or report messages in the guild's
     * channels.
     */
    MANAGE_MESSAGES = (1 << 13),
    /**
     * Embed links and GIFs in messages.
     */
    EMBED_LINKS = (1 << 14),
    /**
     * Attach files to messages.
     */
    ATTACH_FILES = (1 << 15),
    /**
     * Read messages sent before launching the client.
     */
    READ_MESSAGE_HISTORY = (1 << 16),
    /**
     * Mention @everyone, @here, and all roles.
     */
    MENTION_EVERYONE = (1 << 17),
    /**
     * Use emojis from other guilds.
     */
    USE_EXTERNAL_EMOJIS = (1 << 18),
    /**
     * View the guild's insights and stats.
     */
    VIEW_GUILD_INSIGHTS = (1 << 19),
    /**
     * Connect to voice channels.
     */
    CONNECT = (1 << 20),
    /**
     * Speak in voice channels.
     */
    SPEAK = (1 << 21),
    /**
     * Mute members in voice channels.
     */
    MUTE_MEMBERS = (1 << 22),
    /**
     * Deafen members in voice channels.
     */
    DEAFEN_MEMBERS = (1 << 23),
    /**
     * Move members between voice channels and
     * disconnect them completely.
     */
    MOVE_MEMBERS = (1 << 24),
    /**
     * Use voice-activity-detection in voice channels.
     * Removes the need of push-to-talk.
     */
    USE_VAD = (1 << 25),
    /**
     * Change their own nickname.
     */
    CHANGE_NICKNAME = (1 << 26),
    /**
     * Change the nicknames of other members.
     */
    MANAGE_NICKNAMES = (1 << 27),
    /**
     * Manage the guild's roles, including creating,
     * editing, and deleting the roles, and modify the
     * roles of themselves and other members.
     */
    MANAGE_ROLES = (1 << 28),
    /**
     * Create, modify, and delete webhooks, and follow
     * external text channels.
     */
    MANAGE_WEBHOOKS = (1 << 29),
    /**
     * Create, modify, and delete emojis and stickers.
     */
    MANAGE_EMOJIS_AND_STICKERS = (1 << 30),
    /**
     * Use slash and application commands.
     */
    USE_APPLICATION_COMMANDS = (1 << 31),
    /**
     * Request to speak in stage channels.
     */
    REQUEST_TO_SPEAK = (1 << 32),
    /**
     * Manage guild events.
     */
    MANAGE_EVENTS = (1 << 33),
    /**
     * Delete and modify threads.
     */
    MANAGE_THREADS = (1 << 34),
    /**
     * Create public threads.
     */
    CREATE_PUBLIC_THREADS = (1 << 35),
    /**
     * Create private threads.
     */
    CREATE_PRIVATE_THREADS = (1 << 36),
    /**
     * Use stickers from other guilds.
     */
    USE_EXTERNAL_STICKERS = (1 << 37),
    /**
     * Send messages in threads.
     */
    SEND_MESSAGES_IN_THREADS = (1 << 38),
    /**
     * Start embedded activities and applications.
     */
    START_EMBEDDED_ACTIVITIES = (1 << 39),
}