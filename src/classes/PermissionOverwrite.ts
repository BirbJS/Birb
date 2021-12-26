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
import { PermissionResolvable } from '../util/Types';

export default class PermissionOverwrite {

    /**
     * The client this overwrite belongs to.
     */
    client: Client = null!;
    /**
     * The allowed permissions.
     */
    allow: PermissionsBlock = null!;
    /**
     * The denied permissions.
     */
    deny: PermissionsBlock = null!;

    /**
     * A permission overwrite represents a user or role
     * overwrite for a channel.
     * 
     * @param {Client} client The client this overwrite belongs to.
     * @param {PermissionResolvable} allow The allowed permissions.
     * @param {PermissionResolvable} deny The denied permissions.
     */
    constructor (client: Client, allow: PermissionResolvable = 0, deny: PermissionResolvable = 0) {
        this.client = client;
        this.allow = new PermissionsBlock(client, allow);
        this.deny = new PermissionsBlock(client, deny);
    }

    /**
     * Grant the specified permissions.
     * 
     * @param {...PermissionResolvable[]} flags The flags to grant.
     * @returns {PermissionOverwrite} The permission overwrite.
     */
    grant (...flags: PermissionResolvable[]): PermissionOverwrite {
        for ( let i = 0; i < flags.length; ++i ) {
            if (this.deny.has(flags[i])) this.deny.remove(flags[i]);
            else this.allow.add(flags[i]);
        }
        return this;
    }

    /**
     * Revoke the specified permissions.
     * 
     * @param {...PermissionResolvable[]} flags The flags to revoke.
     * @returns {PermissionOverwrite} The permission overwrite.
     */
    revoke (...flags: PermissionResolvable[]): PermissionOverwrite {
        for ( let i = 0; i < flags.length; ++i ) {
            if (this.allow.has(flags[i])) this.allow.remove(flags[i]);
            else this.deny.add(flags[i]);
        }
        return this;
    }

}
