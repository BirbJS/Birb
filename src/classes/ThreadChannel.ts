/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import HTTPChannel from './http/HTTPChannel';
import Client from './Client';
import TextBasedChannel from './TextBasedChannel';

export default class ThreadChannel extends TextBasedChannel {
  /**
   * A ThreadChannel represents a thread on Discord.
   *
   * @param {Client} client The client this channel belongs to.
   * @param {any} data The data of this channel.
   * @param {number} [options.maxSize=null] The maximum size of the cache.
   * @param {number} [options.maxAge=null] The maximum age (in seconds) of the values in the cache.
   * @param {number} [options.checkInterval=60] The interval (in seconds) to check for old values in the cache.
   * @param {boolean} [options.removeOldest=true] Whether to remove the oldest values when the cache is full.
   */
  constructor(
    client: Client,
    data: any,
    options?: {
      maxSize?: number;
      maxAge?: number;
      checkInterval?: number;
      removeOldest?: boolean;
    }
  ) {
    super(client, data, options);
    this.build(data);
  }

  /**
   * Build the ThreadChannel.
   *
   * @param {any} data The data of this channel.
   * @returns {ThreadChannel} This ThreadChannel instance.
   */
  private build(data: any): ThreadChannel {
    return this;
  }

  /**
   * Send a modify request to the API.
   *
   * @param {any} data The data to send.
   * @param {string} [reason] The reason for changing the data.
   * @returns {Promise<ThreadChannel>} This ThreadChannel instance.
   */
  async modify(data: any, reason?: string): Promise<ThreadChannel> {
    let updated = await HTTPChannel.modify(this.client, this.id, data, reason);
    this.build(updated);
    return this.set();
  }

  /**
   * Set the ThreadChannel's data to the cache.
   *
   * @returns {ThreadChannel} This ThreadChannel instance.
   */
  protected set(): ThreadChannel {
    this.guild.channels.cache.set(this.id, this);
    return this;
  }
}
