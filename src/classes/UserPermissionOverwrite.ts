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
import PartialUser from './PartialUser';
import PermissionOverwrite from './PermissionOverwrite';
import User from './User';

export default class UserPermissionOverwrite extends PermissionOverwrite {

    user: User | PartialUser = null!;

    constructor (client: Client, user: User | PartialUser, allow: number = 0, deny: number = 0) {
        super(client, allow, deny);
        this.user = user;
    }

}
