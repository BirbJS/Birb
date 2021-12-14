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
import Role from '../Role';

export default class PermissionsBlock {

    client: Client = null!;
    bits: Permissions = null!;

    constructor (client: Client, ...flags: number[]) {
        this.client = client;
        this.bits = new Permissions(...flags);
    }

    add (...flags: number[]): PermissionsBlock {
        this.bits.add(...flags);
        return this;
    }

    remove (...flags: number[]): PermissionsBlock {
        this.bits.remove(...flags);
        return this;
    }

    has (flag: number, options: {
        adminOverride?: boolean
    } = {
        adminOverride: false
    }): boolean {
        if (options.adminOverride) {
            return this.bits.hasPermission(flag);
        } else {
            return this.bits.has(flag);
        }
    }

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
