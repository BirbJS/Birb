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
     * Allows creation of instant invites.
     */
    CREATE_INSTANT_INVITE = (1 << 0),
    /**
     * Allows kicking members.
     */
    KICK_MEMBERS = (1 << 1),
    /**
     * Allows banning members.
     */
    BAN_MEMBERS = (1 << 2),
    /**
     * Allows all permissions and bypasses channel permission overwrites.
     */
    ADMINISTRATOR = (1 << 3),
    /**
     * Allows management and editing of channels.
     */
    MANAGE_CHANNELS = (1 << 4),
    /**
     * Allows management and editing of the guild.
     */
    MANAGE_GUILD = (1 << 5),
    /**
     * Allows for the addition of reactions to messages.
     */
    ADD_REACTIONS = (1 << 6),
    /**
     * Allows for viewing of audit logs.
     */
    VIEW_AUDIT_LOG = (1 << 7),
    /**
     * Allows for using priority speaker in a voice channel.
     */
    PRIORITY_SPEAKER = (1 << 8),
    /**
     * Allows the user to go live.
     */
    STREAM = (1 << 9),
    /**
     * Allows guild members to view a channel, which includes reading messages in text channels.
     */
    VIEW_CHANNEL = (1 << 10),
    /**
     * Allows for sending messages in a channel. (does not allow sending messages in threads)
     */
    SEND_MESSAGES = (1 << 11),
    /**
     * Allows for sending `/tts` messages.
     */
    SEND_TTS_MESSAGES = (1 << 12),
    /**
     * Allows for deletion of other users messages.
     */
    MANAGE_MESSAGES = (1 << 13),
    /**
     * Links sent by users with this permission will be auto-embedded.
     */
    EMBED_LINKS = (1 << 14),
    /**
     * Allows for uploading images and files.
     */
    ATTACH_FILES = (1 << 15),
    /**
     * Allows for reading of message history.
     */
    READ_MESSAGE_HISTORY = (1 << 16),
    /**
     * Allows for using the `@everyone` tag to notify all users in a channel, and the `@here` tag to notify all online users in a channel.
     */
    MENTION_EVERYONE = (1 << 17),
    /**
     * Allows the usage of custom emojis from other servers.
     */
    USE_EXTERNAL_EMOJIS = (1 << 18),
    /**
     * Allows for viewing guild insights.
     */
    VIEW_GUILD_INSIGHTS = (1 << 19),
    /**
     * Allows for joining a voice channel.
     */
    CONNECT = (1 << 20),
    /**
     * Allows for speaking in a voice channel.
     */
    SPEAK = (1 << 21),
    /**
     * Allows for muting of members in a voice channel.
     */
    MUTE_MEMBERS = (1 << 22),
    /**
     * Allows for deafening of members in a voice channel.
     */
    DEAFEN_MEMBERS = (1 << 23),
    /**
     * Allows for moving of members between voice channels or disconnecting.
     */
    MOVE_MEMBERS = (1 << 24),
    /**
     * Allows for using voice-activity-detection in a voice channel.
     */
    USE_VAD = (1 << 25),
    /**
     * Allows for modification of own nickname.
     */
    CHANGE_NICKNAME = (1 << 26),
    /**
     * Allows for modification of other users nicknames.
     */
    MANAGE_NICKNAMES = (1 << 27),
    /**
     * Allows management and editing of roles.
     */
    MANAGE_ROLES = (1 << 28),
    /**
     * Allows management and editing of webhooks
     */
    MANAGE_WEBHOOKS = (1 << 29),
    /**
     * Allows management and editing of emojis and stickers.
     */
    MANAGE_EMOJIS_AND_STICKERS = (1 << 30),
    /**
     * Allows members to use application commands, including slash commands and context menu commands.
     */
    USE_APPLICATION_COMMANDS = (1 << 31),
    /**
     * Allows for requesting to speak in stage channels.
     */
    REQUEST_TO_SPEAK = (1 << 32),
    /**
     * Allows for creating, editing, and deleting scheduled events.
     */
    MANAGE_EVENTS = (1 << 33),
    /**
     * Allows for deleting and archiving threads, and viewing all private threads.
     */
    MANAGE_THREADS = (1 << 34),
    /**
     * Allows for creating threads.
     */
    CREATE_PUBLIC_THREADS = (1 << 35),
    /**
     * Allows for creating private threads.
     */
    CREATE_PRIVATE_THREADS = (1 << 36),
    /**
     * Allows the usage of custom stickers from other servers.
     */
    USE_EXTERNAL_STICKERS = (1 << 37),
    /**
     * Allows for sending messages in threads.
     */
    SEND_MESSAGES_IN_THREADS = (1 << 38),
    /**
     * Allows for launching activities (applications with the `EMBEDDED` flag) in a voice channel.
     */
    START_EMBEDDED_ACTIVITIES = (1 << 39),
    /**
     * Allows for timing out users to prevent them from sending or reacting to messages in chat and threads, and from speaking in voice and stage channels.
     */
    MODERATE_MEMBERS = (1 << 40),
}
