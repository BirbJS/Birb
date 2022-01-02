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
import BaseUser from './BaseUser';
import GuildMemberRoleBlock from './blocks/GuildMemberRoleBlock';
import Client from './Client';
import HTTPGuild from './http/HTTPGuild';
import OptionError from '../errors/OptionError';

export default class GuildMember {
  /**
   * The client that this member belongs to.
   */
  client: Client = null!;
  /**
   * The user ID of this member.
   */
  readonly id: string;
  /**
   * The guild this member is in.
   */
  guild: Guild = null!;
  /**
   * The user related to this member.
   */
  user: BaseUser | null = null;
  /**
   * The original user object of this member.
   */
  protected originalUser: any = null;
  /**
   * Whether or not this member has been fully resolved.
   */
  protected full: boolean = false;
  /**
   * The nickname of this member.
   */
  nick: string | null = null;
  /**
   * The avatar hash for this member.
   * **Note:** This is not the same as an avatar URL. Use
   * the `displayAvatarURL` method to get the avatar URL
   * of this user.
   */
  avatar: string | null = null;
  /**
   * The date this member joined the guild.
   */
  joinedAt: Date | null = null;
  /**
   * Whether or not this member is deafened in this
   * guild's voice channels. If `true`, the member won't
   * be able to hear anything said in voice channels.
   */
  deafened: boolean = false;
  /**
   * Whether or not this member is muted in this guild's
   * voice channels. If `true`, the member won't be able
   * to say anything in voice channels.
   */
  muted: boolean = false;
  /**
   * The date until this member leaves timeout mode. This
   * will be `null` if the member is not in timeout mode.
   */
  timedOutUntil: Date | null = null;
  /**
   * Whether or not this member is pending membership
   * screening in this guild. Until membership screening
   * is passed, the member may not interact with the
   * guild in any way.
   */
  pendingMembershipScreening: boolean = false;
  /**
   * The roles this member has.
   */
  roles: GuildMemberRoleBlock = null!;

  /**
   * A GuildMember represents a member of a Discord
   * guild (or "server").
   *
   * @param {Client} client The client that this member belongs to.
   * @param {any} data The data of this member.
   * @param {Guild} guild The guild this member is in.
   */
  constructor(client: Client, data: any, guild: Guild) {
    this.client = client;
    this.id = data.user.id;
    this.guild = guild;
    this.build(data);
  }

  /**
   * Build this GuildMember.
   *
   * @param data The data of this GuildMember.
   */
  private build(data: any): GuildMember {
    this.roles = new GuildMemberRoleBlock(this.client);
    if (data.roles) {
      for (let i = 0; i < data.roles.length; i++) {
        this.roles.cache.set(data.roles[i], this.guild.roles.cache.get(data.roles[i]));
      }
    }

    if ('user' in data) {
      this.originalUser = data.user;
      this.user = this.client.users.resolve(data.user.id, data.user) || null;
    }
    if ('nick' in data) {
      this.nick = data.nick;
    }
    if ('avatar' in data) {
      this.avatar = data.avatar;
    }
    if ('joined_at' in data) {
      this.joinedAt = new Date(data.joined_at);
    }
    if ('deaf' in data) {
      this.deafened = data.deaf;
    }
    if ('mute' in data) {
      this.muted = data.mute;
    }
    if ('communication_disabled_until' in data) {
      if (data.communication_disabled_until > new Date()) {
        this.timedOutUntil = new Date(data.communication_disabled_until);
      }
    }
    if ('pending' in data) {
      this.pendingMembershipScreening = data.pending;
    }

    return this;
  }

  /**
   * Check if this GuildMember is in timeout.
   *
   * @returns {boolean} Whether this GuildMember is in timeout.
   */
  isInTimeout(): boolean {
    return this.timedOutUntil !== null && this.timedOutUntil > new Date();
  }

  /**
   * Set this GuildMember's muted status.
   *
   * @param {boolean} deafen The new muted status.
   * @param {String} [reason] The reason for modifying this GuildMember.
   * @returns {Promise<void>} A Promise that voids when the GuildMember has been changed.
   */
  async setMute(mute: boolean, reason?: string): Promise<void> {
    await this.modify(
      {
        mute: mute
      },
      reason
    );
  }

  /**
   * Set this GuildMember's deafened status.
   *
   * @param {boolean} deafen The new deafened status.
   * @param {String} [reason] The reason for modifying this GuildMember.
   * @returns {Promise<void>} A Promise that voids when the GuildMember has been changed.
   */
  async setDeafen(deafen: boolean, reason?: string): Promise<void> {
    await this.modify(
      {
        deaf: deafen
      },
      reason
    );
  }

  /**
   * Set this GuildMember's nickname.
   *
   * @param {number} nickname The new nickname.
   * @param {String} [reason] The reason for modifying this GuildMember.
   * @returns {Promise<void>} A Promise that voids when the GuildMember has been changed.
   */
  async setNick(nickname: string, reason?: string): Promise<void> {
    await this.modify(
      {
        nick: nickname
      },
      reason
    );
  }

  /**
   * Kick the GuildMember.
   *
   * @param {String} [reason] The reason for kicking this GuildMember.
   * @returns {Promise<void>} A Promise that voids when the GuildMember has been changed.
   */
  async kick(reason?: string): Promise<void> {
    await HTTPGuild.removeMember(this.client, this.guild.id, this.id, reason);
  }

  /**
   * Ban the GuildMember.
   *
   * @param {number} [daysToPrune=0] The amount of days of messages to prune.
   * @param {String} [reason] The reason for banning this GuildMember.
   * @returns {Promise<void>} A Promise that voids when the GuildMember has been changed.
   */
  async ban(daysToPrune: number, reason?: string): Promise<void> {
    await HTTPGuild.createBan(
      this.client,
      this.guild.id,
      this.id,
      {
        delete_message_days: daysToPrune || 0
      },
      reason
    );
  }

  /**
   * Modify the GuildMember.
   *
   * @param {Object} data The data to send to the Discord API.
   * @param {String} [reason] The reason for modifying this GuildMember.
   * @returns {Promise<void>} A Promise that voids when the GuildMember has been changed.
   */
  async modify(data: Object, reason?: string): Promise<void> {
    if (data === undefined) {
      throw new OptionError('data [at 0] must be provided');
    }
    await HTTPGuild.modifyMember(this.client, this.guild.id, this.id, data, reason);
  }

  /**
   * Forces the client to wait until the member has been
   * fully resolved. If the member is in the cache, the
   * promise will resolve immediately. However, if the
   * client will fetch the member from the Discord API.
   *
   * @returns {Promise<GuildMember>} A Promise that resolves when the member has been fully resolved.
   */
  async _waitForFull(): Promise<GuildMember> {
    if (this.full) {
      return this;
    }
    if (this.client.me && this.originalUser.id === this.client.me.id) {
      this.user = this.client.me;
    } else {
      this.user = await this.client.users.fetch(this.originalUser.id);
    }
    this.full = true;
    return this;
  }

  /**
   * Sets the GuildMember to the cache.
   *
   * @returns {GuildMember} The GuildMember.
   */
  private set(): GuildMember {
    this.guild.members.cache.set(this.id, this);
    return this;
  }
}
