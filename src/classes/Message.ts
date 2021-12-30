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
import { MessageFlags, MessageTypes, SystemMessageTypes } from '../util/Constants';
import User from './User';
import MessageAttachment from './message/MessageAttachment';
import MessageEmbed from './message/embed/MessageEmbed';

export default class Message {
  /**
   * The client this message belongs to.
   */
  client: Client = null!;
  /**
   * The ID of the message.
   */
  readonly id: string;
  /**
   * The text content of the message.
   */
  content: string | null = null;
  /**
   * The webhook ID if this message was sent by a Discord
   * webhook.
   */
  webhookId: string | null = null;
  /**
   * The guild this message was sent in, if any.
   */
  guild: Guild | null = null;
  /**
   * The author of this message.
   */
  author: BaseUser | null = null;
  /**
   * The member that sent this message if this message
   * was sent in a guild.
   */
  member: GuildMember | null = null;
  /**
   * Whether or not this is a system message (e.g. a
   * welcome message).
   */
  system: boolean = false;
  /**
   * The channel this message was sent in.
   */
  channel: TextBasedChannel = null!;
  /**
   * Any attachments that were sent with this message.
   */
  attachments: MessageAttachment[] = [];
  /**
   * The type of message.
   */
  type: keyof typeof MessageTypes = null!;
  /**
   * This message's bitfield flags.
   */
  flags: bigint = 0n;
  /**
   * Base user data sent by the API/GW.
   */
  private baseAuthor: any = null;

  /**
   * A Message represents a message in any channel on
   * Discord.
   *
   * @param {Client} client The client this message belongs to.
   * @param {any} data The data of the message.
   */
  constructor(client: Client, data: any) {
    this.client = client;
    this.id = data.id;
    this.build(data);
  }

  /**
   * Build the message from the data.
   *
   * @param {any} data The data of the message.
   * @returns {Message} The message.
   */
  private build(data: any): Message {
    this.baseAuthor = data.author || null;

    if ('content' in data) {
      this.content = data.content;
    }
    if ('attachments' in data) {
      this.attachments = MessageAttachment['fromApiMessage'](data.attachments);
    }
    if ('webhook_id' in data) {
      this.webhookId = data.webhook_id;
    }
    if ('guild_id' in data) {
      this.guild = this.client.guilds.cache.get(data.guild_id) || null;
      if (this.guild) this.channel = this.guild.channels.cache.get(data.channel_id);
    }
    if ('member' in data) {
      try {
        data.member.user = this.baseAuthor;
        data.member.id = this.baseAuthor.id;
        this.member = this.guild?.members.resolve(this.baseAuthor.id, data.member) || null;
      } catch (err) {}
    }
    if ('type' in data) {
      if (SystemMessageTypes[data.type]) this.system = true;
      this.type = MessageTypes[data.type] as keyof typeof MessageTypes;
    }
    if (!this.webhookId && !this.system) {
      if (data.author.id == this.client.me?.id) {
        this.author = this.client.me;
      } else {
        this.author = this.client.users.resolve(data.author.id, data.author ?? null) || null;
      }
    }

    return this;
  }

  /**
   * Crosspost this message to channels that are
   * following the channel this message was sent in.
   *
   * @returns {Promise<Message>} The crossposted message.
   */
  async crosspost(): Promise<Message> {
    return this.parse(await HTTPChannel.crossPostMessage(this.client, this.channel.id, this.id));
  }

  /**
   * Delete this message.
   *
   * @returns {Promise<void>} A promise that voids when the message is deleted.
   */
  async delete(): Promise<void> {
    await HTTPChannel.deleteMessage(this.client, this.channel.id, this.id);
  }

  /**
   * Send an inline reply to this message.
   *
   * @param {MessageContent} content The content of the reply.
   * @returns {Promise<Message>} The sent message.
   */
  async reply(message: MessageContent): Promise<Message> {
    await this.waitForAuthor();
    let data = Message.buildApiMessage(message);
    data.message_reference = {
      message_id: this.id,
      channel_id: this.channel.id,
      fail_if_not_exists: false
    };
    let msg = await HTTPChannel.createMessage(this.client, this.channel.id, data);
    return new Message(this.client, msg).waitForAuthor();
  }

  /**
   * Pin this message to the channel it was sent in.
   *
   * @param {string} [reason] The reason for pinning this message.
   * @returns {Promise<Message>} The pinned message.
   */
  async pin(reason?: string): Promise<Message> {
    await HTTPChannel.pinMessage(this.client, this.channel.id, this.id, reason);
    return this;
  }

  /**
   * Unpin this message from the channel it was sent in.
   *
   * @param {string} [reason] The reason for unpinning this message.
   * @returns {Promise<Message>} The unpinned message.
   */
  async unpin(reason?: string): Promise<Message> {
    await HTTPChannel.unpinMessage(this.client, this.channel.id, this.id, reason);
    return this;
  }

  /**
   * Start a thread from this message.
   *
   * @param {string} name The name of the thread.
   * @param {object} [options] The options for the thread.
   * @param {number} [options.autoArchiveDelay] The amount of time to wait before archiving the thread.
   * @param {number} [options.slowmode] The amount of time (in seconds) to set slowmode to for this thread.
   * @param {string} [options.reason] The reason for creating the thread.
   * @returns {Promise<void>} A promise that voids when the thread is created.
   * @todo Make this return a ThreadChannel instead of voiding.
   */
  async startThread(
    name: string,
    options: {
      autoArchiveDelay?: number;
      slowmode?: number;
      reason?: string;
    } = {}
  ) {
    await HTTPChannel.startThreadWithMessage(
      this.client,
      this.channel.id,
      this.id,
      {
        name: name,
        auto_archive_duration: options.autoArchiveDelay ?? null,
        rate_limit_per_user: options.slowmode ?? 0
      },
      options.reason
    );
  }

  /**
   * Supress the embeds of this message.
   *
   * @returns {Promise<Message>} The message.
   */
  async supressEmbeds(): Promise<Message> {
    return this.modify({
      flags: this.flags | MessageFlags.SUPPRESS_EMBEDS
    });
  }

  /**
   * Edit this message. Can only be performed if the
   * message was sent by this client.
   *
   * @param {MessageContent} content The new content of the message.
   * @returns {Promise<Message>} The edited message.
   */
  async edit(message: MessageContent): Promise<Message> {
    return this.modify(Message.buildApiMessage(message, true));
  }

  /**
   * Send a raw API request to edit this message.
   *
   * @param {any} data The data to send.
   * @returns {Promise<Message>} The edited message.
   */
  async modify(data: any): Promise<Message> {
    let res = await HTTPChannel.editMessage(this.client, this.channel.id, this.id, data, this);
    this.build(res);
    return this.set();
  }

  /**
   * Parse data into a message.
   *
   * @param {any} data The data to parse.
   * @returns {Promise<Message>} The parsed message.
   */
  private async parse(data: any): Promise<Message> {
    this.build(data);
    await this.waitForAuthor();
    return this.set();
  }

  /**
   * Wait for the author of the message to be resolved.
   *
   * @returns {Promise<Message>} The message with the resolved author.
   */
  private async waitForAuthor(): Promise<Message> {
    if (!this.author && !this.webhookId && !this.baseAuthor.system) {
      if (this.client.me && this.baseAuthor.id === this.client.me.id) {
        this.author = this.client.me;
      } else {
        this.author = await this.client.users.fetch(this.baseAuthor.id);
      }
    }
    return this;
  }

  /**
   * Set the message to the cache.
   *
   * @returns {Message} The message.
   */
  private set(): Message {
    if (this.guild) this.guild.channels.cache.get(this.channel.id).messages.cache.set(this.id, this);
    return this;
  }

  /**
   * Build an API message.
   *
   * @param {MessageContent} content The content of the message.
   * @param {boolean} [edit] Whether or not this is an edit.
   * @returns {any} The built message.
   */
  protected static buildApiMessage(data: MessageContent, edit: boolean = false): any {
    if (typeof data === 'string') {
      return { content: data };
    }
    if (edit) {
      return {
        content: data.content ?? undefined,
        embeds: data.embeds?.map(e => (e instanceof MessageEmbed ? e.format() : e)) ?? undefined,
        tts: data.tts ?? undefined,
        nonce: data.nonce ?? undefined,
        attachments: data.attachments ?? undefined,
        allowed_mentions: {
          parse: data.allowedMentions?.parse ?? undefined,
          users: data.allowedMentions?.users?.map((u: UserResolvable) => User['toIdOnly'](u)) ?? undefined,
          roles: data.allowedMentions?.roles?.map((r: RoleResolvable) => Role['toIdOnly'](r)) ?? undefined,
          replied_user: data.mentionRepliedUser ?? undefined
        }
      };
    } else {
      return {
        content: data.content ?? null,
        embeds: data.embeds?.map(e => (e instanceof MessageEmbed ? e.format() : e)) ?? [],
        tts: data.tts ?? false,
        nonce: data.nonce ?? null,
        attachments: data.attachments ?? [],
        allowed_mentions: {
          parse: data.allowedMentions?.parse ?? null,
          users: data.allowedMentions?.users?.map((u: UserResolvable) => User['toIdOnly'](u)) ?? null,
          roles: data.allowedMentions?.roles?.map((r: RoleResolvable) => Role['toIdOnly'](r)) ?? null,
          replied_user: data.mentionRepliedUser ?? false
        }
      };
    }
  }
}
