/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Guild, HTTPChannel } from '..';
import BaseUser from './BaseUser';
import Client from './Client';
import GuildMember from './GuildMember';
import TextBasedChannel from './TextBasedChannel';

export default class Message {
    
    client: Client = null!;
    readonly id: string;
    content: string | null = null;
    webhookId: string | null = null;
    guild: Guild | null = null;
    author: BaseUser | null = null;
    member: GuildMember | null = null;
    channel: TextBasedChannel = null!;
    private baseAuthor: any = null;

    constructor (client: Client, data: any) {
        this.client = client;
        this.id = data.id;
        this.build(data);
    }

    private build (data: any): void {
        this.baseAuthor = data.author || null;

        if ('content' in data) {
            this.content = data.content;
        }
        if ('webhook_id' in data) {
            this.webhookId = data.webhook_id;
        }
        if ('guild_id' in data) {
            this.guild = this.client.guilds.cache.get(data.guild_id) || null;
        }
        if ('member' in data) {
            try {
                data.member.user = this.baseAuthor;
                data.member.id = this.baseAuthor.id;
                this.member = this.guild?.members.resolve(this.baseAuthor.id, this.guild, data.member) || null;
            } catch (err) {}
        }

        if (!this.webhookId && !data.author.system) {
            this.author = this.client.users.resolve(data.author.id, data.author ?? null) || null;
        }
        if (this.guild) {
            this.channel = this.guild.channels.cache.get(data.channel_id);
        }
    }

    async crosspost (): Promise<void> {
        await HTTPChannel.crossPostMessage(this.client, this.channel.id, this.id);
    }

    async delete (): Promise<void> {
        await HTTPChannel.deleteMessage(this.client, this.channel.id, this.id);
    }

    async reply (content: string): Promise<Message> {
        await this.waitForAuthor();
        const msg = await HTTPChannel.createMessage(this.client, this.channel.id, {
            content: content,
            message_reference: {
                message_id: this.id,
                channel_id: this.channel.id,
                fail_if_not_exists: false,
            },
        });
        return new Message(this.client, msg);
    }

    private async waitForAuthor (): Promise<Message> {
        if (!this.author && !this.webhookId && !this.baseAuthor.system) {
            if (this.client.me && this.baseAuthor.id === this.client.me.id) {
                this.author = this.client.me;
            } else {
                this.author = await this.client.users.fetch(this.baseAuthor.id);
            }
        }
        return this;
    }

    private set (): Message {
        if (this.guild) {
            this.guild.channels.cache.get(this.channel.id).messages.cache.set(this.id, this);
        }
        return this;
    }

}
