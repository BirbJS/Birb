/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Channel from '../classes/Channel';
import { ChannelResolvable } from './Types';

export default class Validator {

    static parseChannel (channel: ChannelResolvable): string {
        if (channel instanceof Channel) return channel.id;
        if (typeof channel === 'string') return channel;
        throw new Error('Invalid channel provided; parsing failed');
    }

}
