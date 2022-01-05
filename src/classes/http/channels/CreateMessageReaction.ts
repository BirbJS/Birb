/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Client from '../../Client';
import Request from '../Request';

export default class CreateMessageReaction extends Request {
  constructor(client: Client, channelId: string, messageId: string, emoji: string) {
    emoji = encodeURIComponent(emoji);
    super(client, 'PUT', `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`);
  }
}
