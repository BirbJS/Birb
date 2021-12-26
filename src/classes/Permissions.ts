/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BitsBlock from './blocks/BitsBlock';
import { Permissions as PermissionFlags } from '../util/Constants';
import { PermissionResolvable } from '../util/Types';
import PermissionsBlock from './blocks/PermissionsBlock';

export default class Permissions extends BitsBlock<keyof typeof PermissionFlags> {

    /**
     * The permission flags available.
     */
    static FLAGS = PermissionFlags

    /**
     * Permissions objects store permission data.
     * 
     * @param {PermissionResolvable} flags The permission flags.
     */
    constructor (flags?: PermissionResolvable) {
        super(Permissions.FLAGS, flags);
    }

    convert(flags: PermissionResolvable): number {
        if(flags instanceof Permissions) {
            return flags.bitfield
        } else if(flags instanceof PermissionsBlock) {
            return flags.permissions.bitfield
        } else {
            return super.convert(flags)
        }
    }

    /**
     * Check whether or not the permission flags exist on
     * this Permissions object, whilst taking the
     * administrator permission into account. If you want
     * to ignore the administrator permission, use the
     * `has` method instead.
     * 
     * @param {PermissionResolvable} flag The permission flag to check for.
     * @returns {boolean} Whether or not the permission flag exists.
     */
     has (flags: PermissionResolvable, options: {
        adminOverride: boolean
    } = { 
        adminOverride: true 
    }): boolean {
        return (options.adminOverride && super.has("ADMINISTRATOR")) || super.has(flags)
    }

}