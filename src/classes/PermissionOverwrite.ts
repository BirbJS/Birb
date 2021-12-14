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
import PermissionsBlock from './blocks/PermissionsBlock';

export default class PermissionOverwrite {

    client: Client = null!;
    allow: PermissionsBlock = null!;
    deny: PermissionsBlock = null!;

    constructor (client: Client, allow: number = 0, deny: number = 0) {
        this.client = client;
        this.allow = new PermissionsBlock(client, allow);
        this.deny = new PermissionsBlock(client, deny);
    }

    grant (...flags: number[]) {
        for ( let i = 0; i < flags.length; ++i ) {
            if (this.deny.has(flags[i])) this.deny.remove(flags[i]);
            else this.allow.add(flags[i]);
        }
        return this;
    }

    revoke (...flags: number[]) {
        for ( let i = 0; i < flags.length; ++i ) {
            if (this.allow.has(flags[i])) this.allow.remove(flags[i]);
            else this.deny.add(flags[i]);
        }
        return this;
    }

}
