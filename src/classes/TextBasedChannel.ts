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

    /**
     * The messages in this channel.
     */
    messages: MessageBlock;

    /**
     * A TextBasedChannel represents any guild channel that
     * allows messages to be sent and received.
     * 
     * @param {Client} client The client this channel belongs to.
     * @param {any} data The data of this channel.
     * @param {object} [options] The options of this channel.
     * @param {number} [options.maxSize=null] The maximum size of the cache.
     * @param {number} [options.maxAge=null] The maximum age (in seconds) of the values in the cache.
     * @param {number} [options.checkInterval=60] The interval (in seconds) to check for old values in the cache.
     * @param {boolean} [options.removeOldest=true] Whether to remove the oldest values when the cache is full.
     * @param {Guild} [guild] The guild this channel belongs to.
     */
    constructor (client: Client, data: any, options?: {
        maxSize?: number,
        maxAge?: number,
        checkInterval?: number,
        removeOldest?: boolean,
    }, guild?: Guild) {
        super(client, data, guild);
        this.messages = new MessageBlock(client, this.guild, options);
    }

    /**
     * Sends a message to this channel.
     * 
     * @param {MessageContent} content The content of the message.
     * @returns {Promise<Message>} The sent message.
     */
    async send (message: MessageContent): Promise<Message> {
        let data = Message['buildApiMessage'](message);
        let created = await HTTPChannel.createMessage(this.client, this.id, data);
        created.guild_id = this.guild.id;
        let msg = await (new Message(this.client, created))['waitForAuthor']();
        this.messages.cache.set(msg.id, msg);
        return msg;
    }

}
