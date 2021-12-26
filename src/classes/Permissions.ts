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
import { BitsResolvable } from '../util/Types';

export default class Permissions extends BitsBlock<keyof typeof PermissionFlags> {

    /**
     * The permission flags available.
     */
    static FLAGS = PermissionFlags

    /**
     * Permissions objects store permission data.
     * 
     * @param {number} flags The permission flags.
     */
    constructor (flags: BitsResolvable<keyof typeof PermissionFlags>) {
        super(Permissions.FLAGS, flags);
    }

    /**
     * Check whether or not the permission flags exist on
     * this Permissions object, whilst taking the
     * administrator permission into account. If you want
     * to ignore the administrator permission, use the
     * `has` method instead.
     * 
     * @param {number} flag The permission flag to check for.
     * @returns {boolean} Whether or not the permission flag exists.
     */
    has (flags: BitsResolvable<keyof typeof PermissionFlags>): boolean {
        return super.has(flags) || super.has("ADMINISTRATOR")
    }

}
