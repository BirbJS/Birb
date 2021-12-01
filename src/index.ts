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

import BitsBlock from './classes/blocks/BitsBlock';
import GuildBlock from './classes/blocks/GuildBlock';

import HTTPGuild from './classes/http/HTTPGuild';
import Request from './classes/http/Request';

import Websocket from './classes/websocket/Websocket';

import Cache from './classes/Cache';
import Client from './classes/Client';
import Guild from './classes/Guild';
import Intents from './classes/Intents';
import Pair from './classes/Pair';
import Role from './classes/Role';

import BirbJSError from './errors/BirbJSError';
import CacheError from './errors/CacheError';
import ClientError from './errors/ClientError';
import ClientWarning from './errors/ClientWarning';
import GuildError from './errors/GuildError';
import MemoryLeakWarning from './errors/MemoryLeakWarning';
import ShardingError from './errors/ShardingError';
import WebsocketError from './errors/WebsocketError';
import WebsocketProcessingError from './errors/WebsocketProcessingError';
import WebsocketWarning from './errors/WebsocketWarning';

import Color from './util/Color';

import {
    NSFWLevel,
    MFALevel,
    ExplicitContentFilterLevel,
    NotificationLevel,
    VerificationLevel,
    Status,
    PacketOperation,
    GatewayCloseCode,
} from './util/Constants';

import {
    GuildResolvable,
    RoleResolvable,
    UserResolvable,
    EventResolvable,
} from './util/Types';

export {
    BitsBlock,
    GuildBlock,

    HTTPGuild,
    Request,

    Websocket,

    Cache,
    Client,
    Guild,
    Intents,
    Pair,
    Role,

    BirbJSError,
    CacheError,
    ClientError,
    ClientWarning,
    GuildError,
    MemoryLeakWarning,
    ShardingError,
    WebsocketError,
    WebsocketProcessingError,
    WebsocketWarning,

    Color,

    NSFWLevel,
    MFALevel,
    ExplicitContentFilterLevel,
    NotificationLevel,
    VerificationLevel,
    Status,
    PacketOperation,
    GatewayCloseCode,

    GuildResolvable,
    RoleResolvable,
    UserResolvable,
    EventResolvable,
};

export function _test () {
    console.info('test passed; index.ts is valid')
}
