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
import TextChannel from './TextChannel';

export default class Channel {
  /**
   * The client this channel belongs to.
   */
  client: Client = null!;
  /**
   * The name of this channel.
   */
  name: string = null!;
  /**
   * The ID of this channel.
   */
  readonly id: string;

  /**
   * Represents any kind of channel on Discord.
   *
   * @param {Client} client The client this channel belongs to.
   * @param {any} data The data of this channel.
   */
  constructor(client: Client, data: any) {
    this.client = client;
    this.id = data.id;
    this.name = data.name;
  }

  /**
   * Initialize the data of this channel.
   *
   * @returns {any} The channel object, or `null`.
   */
  protected init(): any {
    if (this instanceof TextChannel) {
      return this;
    }
  }
}
