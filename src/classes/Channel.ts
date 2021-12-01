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

export default class Channel {

    client: Client = null!;
    name: string = null!;
    readonly id: string;

    constructor (client: Client, data: any) {
        this.client = client;
        this.id = data.id;
        this.name = data.name;
    }

}
