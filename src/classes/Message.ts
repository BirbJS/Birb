/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Guild from './Guild';
import HTTPChannel from './http/HTTPChannel';
import Role from './Role';
import BaseUser from './BaseUser';
import Client from './Client';
import GuildMember from './GuildMember';
import TextBasedChannel from './TextBasedChannel';
import { UserResolvable, RoleResolvable, MessageContent } from '../util/Types';
import Embed from './message/embed/MessageEmbed';
import { MessageFlags } from '../util/Constants';
import User from './User';
import MessageAttachment from './message/MessageAttachment';
import { ReadStream } from 'fs';

export default class Message {
    
    client: Client = null!;
    readonly id: string;
    content: string | null = null;
    webhookId: string | null = null;
    guild: Guild | null = null;
    author: BaseUser | null = null;
    member: GuildMember | null = null;
    channel: TextBasedChannel = null!;
    flags: number = 0;
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
            if (data.author.id == this.client.me?.id) {
                this.author = this.client.me;
            } else {
                this.author = this.client.users.resolve(data.author.id, data.author ?? null) || null;
            }
        }
        if (this.guild) {
            this.channel = this.guild.channels.cache.get(data.channel_id);
        }
    }

    async crosspost (): Promise<Message> {
        return this.parse(await HTTPChannel.crossPostMessage(this.client, this.channel.id, this.id));
    }

    async delete (): Promise<void> {
        await HTTPChannel.deleteMessage(this.client, this.channel.id, this.id);
    }

    async reply (message: MessageContent): Promise<Message> {
        await this.waitForAuthor();
        let data = Message.buildApiMessage(message);
        data.message_reference = {
            message_id: this.id,
            channel_id: this.channel.id,
            fail_if_not_exists: false,
        }
        let msg = await HTTPChannel.createMessage(this.client, this.channel.id, data);
        return new Message(this.client, msg).waitForAuthor();
    }

    async pin (reason?: string): Promise<Message> {
        await HTTPChannel.pinMessage(this.client, this.channel.id, this.id, reason);
        return this;
    }

    async unpin (reason?: string): Promise<Message> {
        await HTTPChannel.unpinMessage(this.client, this.channel.id, this.id, reason);
        return this;
    }

    async startThread (name: string, options: {
        autoArchiveDelay?: number,
        slowmode?: number,
        reason?: string
    } = {}) {
        await HTTPChannel.startThreadWithMessage(this.client, this.channel.id, this.id, {
            name: name,
            auto_archive_duration: options.autoArchiveDelay ?? null,
            rate_limit_per_user: options.slowmode ?? 0,
        }, options.reason);
    }

    async supressEmbeds (): Promise<Message> {
        return this.modify({
            flags: this.flags | MessageFlags.SUPPRESS_EMBEDS,
        });
    }

    async edit (message: MessageContent): Promise<Message> {
        return this.modify(Message.buildApiMessage(message, true));
    }
    
    async modify (data: any): Promise<Message> {
        let res = await HTTPChannel.editMessage(this.client, this.channel.id, this.id, data);
        this.build(res);
        return this.set();
    }

    private async parse (data: any): Promise<Message> {
        this.build(data);
        await this.waitForAuthor();
        return this.set();
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

    private static buildApiMessage (data: MessageContent, edit: boolean = false): any {
        if (typeof data === 'string') {
            return { content: data };
        }
        if (data instanceof Embed) {
            return { embeds: [ data.format() ] };
        }
        if (edit) {
            return {
                content: data.content ?? undefined,
                embeds: data.embeds?.map(e => e.format()) ?? undefined,
                tts: data.tts ?? undefined,
                nonce: data.nonce ?? undefined,
                attachments: data.attachments ?? [],
                allowed_mentions: {
                    parse: data.allowedMentions?.parse ?? undefined,
                    users: data.allowedMentions?.users?.map((u: UserResolvable) => User['toIdOnly'](u)) ?? undefined,
                    roles: data.allowedMentions?.roles?.map((r: RoleResolvable) => Role['toIdOnly'](r)) ?? undefined,
                    replied_user: data.mentionRepliedUser ?? undefined,
                },
            };
        } else {
            return {
                content: data.content ?? null,
                embeds: data.embeds?.map(e => e.format()) ?? [],
                tts: data.tts ?? false,
                nonce: data.nonce ?? null,
                attachments: data.attachments ?? [],
                allowed_mentions: {
                    parse: data.allowedMentions?.parse ?? null,
                    users: data.allowedMentions?.users?.map((u: UserResolvable) => User['toIdOnly'](u)) ?? null,
                    roles: data.allowedMentions?.roles?.map((r: RoleResolvable) => Role['toIdOnly'](r)) ?? null,
                    replied_user: data.mentionRepliedUser ?? false,
                },
            };
        }
    }

}
