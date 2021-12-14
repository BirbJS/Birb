/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Client from '../Client';
import Guild from '../Guild';
import Cache from './Cache';

export default class CGCache extends Cache {

    client: Client = null!;
    guild: Guild = null!;

    constructor (client: Client, guild: Guild, options?: {
        maxSize?: number,
        maxAge?: number,
        checkInterval?: number,
        removeOldest?: boolean,
    }) {
        super(options);
        this.client = client;
        this.guild = guild;
    }

    strip (data: any): any {
        delete data.client;
        delete data.guild;
        return data;
    }

    rebuild (data: any): any {
        data.client = this.client;
        data.guild = this.guild;
        return data;
    }

}
