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
import { Permissions as PermissionEnums } from '../util/Constants';
import { PermissionResolvable } from '../util/Types';
import PermissionsBlock from './blocks/PermissionsBlock';

type PermissionFlags = keyof typeof PermissionEnums

export default class Permissions extends BitsBlock<PermissionFlags> {

    /**
     * The permission flags available.
     */
    static FLAGS = PermissionEnums

    /**
     * Permissions objects store permission data.
     * 
     * @param {PermissionResolvable} flags The permission flags.
     */
    constructor (flags?: PermissionResolvable) {
        super(PermissionEnums, flags);
    }

    convert(flags: PermissionResolvable): bigint {
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

    clone() {
        return new Permissions(this.bitfield)
    }

    toArray(hasParams?: { adminOverride: boolean }): PermissionFlags[] {
        return Object.keys(this.FLAGS).filter(bit => this.has(bit as PermissionFlags, hasParams)) as PermissionFlags[]
    }

}