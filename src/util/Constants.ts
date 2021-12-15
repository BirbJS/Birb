/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
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

export enum NSFWLevel {
    UNKNOWN = 0,
    EXPLICIT = 1,
    SAFE = 2,
    AGE_RESTRICTED = 3,
}

export enum MFALevel {
    NONE = 0,
    ELEVATED = 1,
}

export enum ExplicitContentFilterLevel {
    DISABLED = 0,
    MEMBERS_WITHOUT_ROLES = 1,
    ALL_MEMBERS = 2
}

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

export enum ActivityType {
    PLAYING = 0,
    STREAMING = 1,
    LISTENING = 2,
    WATCHING = 3,
    CUSTOM = 4,
    COMPETING = 5,
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
