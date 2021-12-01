/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Client from './Client';
import MessageBlock from './blocks/MessageBlock';
import Channel from './Channel';

export default class TextBasedChannel extends Channel {

    readonly messages: MessageBlock;

    constructor (client: Client, data: any, options?: {
        maxSize?: number,
        maxAge?: number,
        checkInterval?: number,
        removeOldest?: boolean,
    }) {
        super(client, data);
        this.messages = new MessageBlock(client, options);
    }

}
