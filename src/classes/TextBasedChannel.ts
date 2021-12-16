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
import GuildChannel from './GuildChannel';
import { MessageContent } from '../util/Types';
import Message from './Message';
import HTTPChannel from './http/HTTPChannel';
import Guild from './Guild';

export default abstract class TextBasedChannel extends GuildChannel {

    readonly messages: MessageBlock;

    constructor (client: Client, data: any, options?: {
        maxSize?: number,
        maxAge?: number,
        checkInterval?: number,
        removeOldest?: boolean,
    }, guild?: Guild) {
        super(client, data, guild);
        this.messages = new MessageBlock(client, this.guild, options);
    }

    async send (message: MessageContent): Promise<Message> {
        let data = Message['buildApiMessage'](message);
        let created = await HTTPChannel.createMessage(this.client, this.id, data);
        let msg = await (new Message(this.client, created))['waitForAuthor']();
        this.messages.cache.set(msg.id, msg);
        return msg;
    }

}
