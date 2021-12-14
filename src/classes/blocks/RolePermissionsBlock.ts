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
import Role from '../Role';
import PermissionsBlock from './PermissionsBlock';
import BitsBlock from './BitsBlock';

export default class RolePermissionsBlock extends PermissionsBlock {

    role: Role = null!;

    constructor (client: Client, role: Role, ...flags: number[]) {
        super(client, ...flags);
        this.role = role;
    }

    /**
     * Grant the role the specified permissions.
     * 
     * @param {Permissions.FLAGS | number[] | number} permissions The permissions to grant.
     * @param {Object} options The options for the action.
     * @param {string} [options.reason] The reason for the action.
     * @returns {Promise<Role>} A Promise that resolves to the modified Role.
     */
    async grant (permissions: number[] | number, options: {
        reason?: string
    } = {}): Promise<Role> {
        let bits = this.bits.clone();
        if (typeof permissions == 'number') {
            bits.add(permissions);
        } else {
            for ( let i = 0; i < permissions.length; ++i ) bits.add(permissions[i]);
        }
        return await this.set(bits.flags, options);
    }

    /**
     * Revoke the specified permissions from the Role.
     * 
     * @param {Permissions.FLAGS | number[] | number} permissions The permissions to revoke.
     * @param {Object} options The options for the action.
     * @param {string} [options.reason] The reason for the action.
     * @returns {Promise<Role>} A Promise that resolves to the modified Role.
     */
    async revoke (permissions: number[] | number, options: {
        reason?: string
    } = {}): Promise<Role> {
        let bits = this.bits.clone();
        if (typeof permissions == 'number') {
            bits.remove(permissions);
        } else {
            for ( let i = 0; i < permissions.length; ++i ) bits.remove(permissions[i]);
        }
        return await this.set(bits.flags, options);
    }

    /**
     * Set the permissions for the Role.
     * 
     * @param {Permissions.FLAGS | number[] | number} permissions The permissions to set.
     * @param {Object} options The options for the action.
     * @param {string} [options.reason] The reason for the action.
     * @returns {Promise<Role>} A Promise that resolves to the modified Role.
     */
    async set (permissions: number[] | number, options: {
        reason?: string
    } = {}): Promise<Role> {
        let bits = new BitsBlock(0);
        if (typeof permissions == 'number') {
            bits.set(permissions);
        } else {
            for ( let i = 0; i < permissions.length; ++i ) bits.add(permissions[i]);
        }
        if (bits.flags == this.bits.flags) return this.role;
        return await this.role.modify({ permissions: bits.flags }, options.reason);
    }

}
