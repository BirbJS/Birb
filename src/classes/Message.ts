/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Guild } from '..';
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
        this._build(data);
    }

    _build (data: any): void {
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
            this.author = this.client.users.resolve(data.author.id) || null;
        }
        if (this.guild) {
            this.channel = this.guild.channels.cache.get(data.channel_id);
        }
    }

    async _waitForAuthor (): Promise<Message> {
        if (!this.webhookId && !this.baseAuthor.system) {
            if (this.client.me && this.baseAuthor.id === this.client.me.id) {
                this.author = this.client.me;
            } else {
                this.author = await this.client.users.fetch(this.baseAuthor.id);
            }
        }
        return this;
    }

    _set (): Message {
        if (this.guild) {
            this.guild.channels.cache.get(this.channel.id).messages.cache.set(this.id, this);
        }
        return this;
    }

}
