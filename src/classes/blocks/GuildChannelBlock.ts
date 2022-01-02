/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ReferenceCache from '../cache/ReferenceCache';
import Client from '../Client';

export default class GuildChannelBlock {
  /**
   * The client that initiliazed the block.
   */
  client: Client = null!;
  /**
   * The cache full of channels.
   */
  cache: ReferenceCache = null!;

  /**
   * A GuildChannelBlock stores guild channel data.
   *
   * @param {Client} client The client instance.
   */
  constructor(client: Client) {
    this.client = client;
    this.cache = new ReferenceCache(client, 'channels');
  }
}
