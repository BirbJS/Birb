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
 * WHEN EDITING THIS, THERE ARE SOME RULES WE NEED TO READ,
 * FOLLOW, AND BE AWARE OF:
 * 
 *  - If importing a class, type, enum or other property,
 *    you must add it in alphabetical order. It must also
 *    be sorted based on the file structure. Usually, your
 *    IDE should show this for you.
 *  - When exporting, you should add the properties in the
 *    order they're imported.
 *  - Do not modify this comment.
 */

import { Snowflake } from '@sapphire/snowflake';

import BitsBlock from './classes/blocks/BitsBlock';
import CachedBlock from './classes/blocks/CachedBlock';
import ChannelBlock from './classes/blocks/ChannelBlock';
import ChannelPermissionsBlock from './classes/blocks/ChannelPermissionsBlock';
import GuildBlock from './classes/blocks/GuildBlock';
import GuildMemberBlock from './classes/blocks/GuildMemberBlock';
import GuildMemberRoleBlock from './classes/blocks/GuildMemberRoleBlock';
import MessageBlock from './classes/blocks/MessageBlock';
import PermissionsBlock from './classes/blocks/PermissionsBlock';
import RoleBlock from './classes/blocks/RoleBlock';
import RolePermissionsBlock from './classes/blocks/RolePermissionsBlock';
import UserBlock from './classes/blocks/UserBlock';

import Cache from './classes/cache/Cache';
import CCache from './classes/cache/CCache';
import CGCache from './classes/cache/CGCache';

import HTTPChannel from './classes/http/HTTPChannel';
import HTTPGuild from './classes/http/HTTPGuild';
import HTTPUser from './classes/http/HTTPUser';
import Request from './classes/http/Request';

import EmbedAuthor from './classes/message/embed/EmbedAuthor';
import EmbedChild from './classes/message/embed/EmbedChild';
import EmbedField from './classes/message/embed/EmbedField';
import EmbedFooter from './classes/message/embed/EmbedFooter';
import EmbedMedia from './classes/message/embed/EmbedMedia';
import MessageEmbed from './classes/message/embed/MessageEmbed';

import BaseComponent from './classes/message/BaseComponent';
import MessageAttachment from './classes/message/MessageAttachment';

import InternalWebsocket from './classes/websocket/InternalWebsocket';
import Websocket from './classes/websocket/Websocket';

import BaseUser from './classes/BaseUser';
import Channel from './classes/Channel';
import Client from './classes/Client';
import ClientUser from './classes/ClientUser';
import Guild from './classes/Guild';
import GuildChannel from './classes/GuildChannel';
import GuildMember from './classes/GuildMember';
import Intents from './classes/Intents';
import Message from './classes/Message';
import PartialUser from './classes/PartialUser';
import PermissionOverwrite from './classes/PermissionOverwrite';
import Permissions from './classes/Permissions';
import Role from './classes/Role';
import RolePermissionOverwrite from './classes/RolePermissionOverwrite';
import TextBasedChannel from './classes/TextBasedChannel';
import TextChannel from './classes/TextChannel';
import ThreadChannel from './classes/ThreadChannel';
import User from './classes/User';
import UserPermissionOverwrite from './classes/UserPermissionOverwrite';

import Addons from './util/Addons';
import Color from './util/Color';
import {
    Intents as IntentFlags,
    NSFWLevel,
    MFALevel,
    ExplicitContentFilterLevel,
    NotificationLevel,
    VerificationLevel,
    Status as WebsocketStatus,
    PacketOperation,
    GatewayCloseCode,
    ActivityType,
    MessageFlags,
    MessageTypes,
    SystemMessageTypes,
} from './util/Constants';
import Pair from './util/Pair';
import {
    GuildResolvable,
    RoleResolvable,
    ChannelResolvable,
    UserResolvable,
    EventResolvable,
    ActivityStatus,
    MessageContent,
} from './util/Types';
import Validator from './util/Validator';

export {
    
    Snowflake,

    BitsBlock,
    CachedBlock,
    ChannelBlock,
    ChannelPermissionsBlock,
    GuildBlock,
    GuildMemberBlock,
    GuildMemberRoleBlock,
    MessageBlock,
    PermissionsBlock,
    RoleBlock,
    RolePermissionsBlock,
    UserBlock,

    Cache,
    CCache,
    CGCache,

    HTTPChannel,
    HTTPGuild,
    HTTPUser,
    Request,

    EmbedAuthor,
    EmbedChild,
    EmbedField,
    EmbedFooter,
    EmbedMedia,
    MessageEmbed,

    BaseComponent,
    MessageAttachment,

    Websocket,
    InternalWebsocket,

    BaseUser,
    Channel,
    Client,
    ClientUser,
    Guild,
    GuildChannel,
    GuildMember,
    Intents,
    Message,
    PartialUser,
    PermissionOverwrite,
    Permissions,
    Role,
    RolePermissionOverwrite,
    TextBasedChannel,
    TextChannel,
    ThreadChannel,
    User,
    UserPermissionOverwrite,

    Addons,
    Color,
    IntentFlags,
    NSFWLevel,
    MFALevel,
    ExplicitContentFilterLevel,
    NotificationLevel,
    VerificationLevel,
    WebsocketStatus,
    PacketOperation,
    GatewayCloseCode,
    ActivityType,
    MessageFlags,
    MessageTypes,
    SystemMessageTypes,

    GuildResolvable,
    RoleResolvable,
    ChannelResolvable,
    UserResolvable,
    EventResolvable,
    ActivityStatus,
    MessageContent,

    Validator,

};

export function _test () {
    console.info('test passed; index.ts is valid')
}
