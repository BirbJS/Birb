/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Websocket from "./classes/websocket/Websocket";
import InternalWebsocket from "./classes/websocket/InternalWebsocket";
import BirbJSError from "./errors/BirbJSError";
import WebsocketProcessingError from "./errors/WebsocketProcessingError";
import { Status } from "./util/Constants";
import Client from "./classes/Client";

export {
    BirbJSError,
    WebsocketProcessingError,
    Status,
    Client,
    Websocket,
    InternalWebsocket,
    
};

export function _test () {
    console.info('test passed; index.ts is valid')
}
