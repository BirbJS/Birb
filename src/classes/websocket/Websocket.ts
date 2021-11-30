/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Client from "../Client";
import InternalWebsocket from "./InternalWebsocket";

export default class Websocket extends InternalWebsocket {

    ws = null;
    lastHeartbeat = 0;
    lastHeartbeatAcked = false;
    heartbeatInterval = null;
    schedulerLoop: NodeJS.Timer = null!;
    lastSequenceIdentifier = null;
    sessionIdentifier = null;
    expectedGuilds = null;

    /**
     * Creates a websocket connection to a Discord gateway.
     * 
     * @param {Client} client The client.
     * @param {string} url The url to connect to.
     */
    constructor (client: Client, url: string) {
        super(client, url);
        this.scheduler();
    }

    /**
     * Creates a loop that will manage repeating tasks. It
     * will call it's method every 50ms.
     * 
     * @returns {void}
     * @private
     */
    private scheduler () {
        if (this.schedulerLoop) {
            clearInterval(this.schedulerLoop);
        }
        this.schedulerLoop = setInterval(() => {
            
        }, 50);
    }

}
