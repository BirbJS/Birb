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

export default class PermissionsBlock {

    /**
     * The client that initiliazed the block.
     */
    client: Client = null!;
    /**
     * The permissions bits.
     */
    bits: Permissions = null!;

    /**
     * The PermissionsBlock stores permissions data.
     * 
     * @param {Client} client The client instance.
     * @param {number} [flags] The permissions bits.
     */
    constructor (client: Client, ...flags: number[]) {
        this.client = client;
        this.bits = new Permissions(...flags);
    }

    /**
     * Add a permission bit.
     * 
     * @param {number} flags The permission bit.
     * @returns {PermissionsBlock} The updated PermissionsBlock.
     */
    add (...flags: number[]): PermissionsBlock {
        this.bits.add(...flags);
        return this;
    }

    /**
     * Remove a permission bit.
     * 
     * @param {number} flags The permission bit.
     * @returns {PermissionsBlock} The updated PermissionsBlock.
     */
    remove (...flags: number[]): PermissionsBlock {
        this.bits.remove(...flags);
        return this;
    }

    /**
     * Check if the PermissionsBlock has a permission bit.
     * 
     * @param {number} flag The permission bit.
     * @param {object} [options] The options.
     * @param {boolean} [options.adminOverride=true] Whether or not to take administrator permissions into account.
     * @returns {boolean} Whether or not the PermissionsBlock has the permission bit.
     */
    has (flag: number, options: {
        adminOverride?: boolean
    } = {
        adminOverride: true
    }): boolean {
        if (options.adminOverride) {
            return this.bits.hasPermission(flag);
        } else {
            return this.bits.has(flag);
        }
    }

    /**
     * Compare the PermissionsBlock to another PermissionsBlock.
     * 
     * @param {PermissionsBlock | Permissions | number} check The PermissionsBlock or Permissions to compare to.
     * @returns {boolean} Whether or not the PermissionsBlock has the same permissions as the other.
     */
    equals (check: PermissionsBlock | Permissions | number): boolean {
        if (check instanceof PermissionsBlock) {
            return this.bits.flags == check.bits.flags;
        } else if (check instanceof Permissions) {
            return this.bits.flags == check.flags;
        } else if (typeof check == 'number') {
            return this.bits.flags == check;
        } else {
            throw new TypeError(`Expected PermissionsBlock, Permissions or number, got ${typeof check}`);
        }
    }

}
