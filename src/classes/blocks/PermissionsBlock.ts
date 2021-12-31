/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Permissions from '../Permissions';
import Client from '../Client';
import { PermissionResolvable } from '../../util/Types';

export default class PermissionsBlock {

    /**
     * The client that initiliazed the block.
     */
    client: Client = null!;
    /**
     * The permissions bits.
     */
    permissions: Permissions = null!;

    /**
     * The PermissionsBlock stores permissions data.
     * 
     * @param {Client} client The client instance.
     * @param {Permissions.FLAGS | Permissions.FLAGS[] | number} [flags] The permissions bits.
     */
    constructor (client: Client, flags: PermissionResolvable) {
        this.client = client;
        this.permissions = new Permissions(flags);
    }

    /**
     * Add a permission bit.
     * 
     * @param {Permissions.FLAGS | Permissions.FLAGS[] | number} flags The permission bit.
     * @returns {PermissionsBlock} The updated PermissionsBlock.
     */
    add (...flags: PermissionResolvable[]): PermissionsBlock {
        this.permissions.add(...flags);
        return this;
    }

    /**
     * Remove a permission bit.
     * 
     * @param {Permissions.FLAGS | Permissions.FLAGS[] | number} flags The permission bit.
     * @returns {PermissionsBlock} The updated PermissionsBlock.
     */
    remove (...flags: PermissionResolvable[]): PermissionsBlock {
        this.permissions.remove(...flags);
        return this;
    }

    /**
     * Check if the PermissionsBlock has a permission bit.
     * 
     * @param {Permissions.FLAGS | Permissions.FLAGS[] | number} flag The permission bit.
     * @param {object} [options] The options.
     * @param {boolean} [options.adminOverride=true] Whether or not to take administrator permissions into account.
     * @returns {boolean} Whether or not the PermissionsBlock has the permission bit.
     */
    has (flag: PermissionResolvable, options: {
        adminOverride?: boolean
    } = {
        adminOverride: true
    }): boolean {
        if (options.adminOverride) {
            return this.permissions.has(flag);
        } else {
            return this.permissions.has(flag);
        }
    }

    /**
     * Compare the PermissionsBlock to another PermissionsBlock.
     * 
     * @param {PermissionsBlock | Permissions | Permissions.FLAGS | Permissions.FLAGS[] | number} check The PermissionsBlock or Permissions to compare to.
     * @returns {boolean} Whether or not the PermissionsBlock has the same permissions as the other.
     */
    equals (check: PermissionsBlock | Permissions | PermissionResolvable): boolean {
        if (check instanceof PermissionsBlock) {
            return this.permissions.bitfield == check.permissions.bitfield;
        } else if (check instanceof Permissions) {
            return this.permissions.bitfield == check.bitfield;
        } else if (typeof check == 'number' || typeof check === 'bigint') {
            return this.permissions.bitfield == BigInt(check);
        } else {
            throw new TypeError(`Expected PermissionsBlock, Permissions, or PermissionResolvable, got ${typeof check}`);
        }
    }

}
