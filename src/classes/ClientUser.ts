/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BaseUser from "./BaseUser";
import Client from "./Client";

export default class ClientUser extends BaseUser {

    bot: boolean = true;
    system: boolean = false;

    constructor (client: Client, data: any) {
        super(client, data);
        this._build(data);
    }

    _build (data: any) {
        this.username = data.username ?? 'Unknown';
        this.discriminator = data.discriminator ?? '0000';
        this.tag = `${this.username}#${this.discriminator}`;
        this.flags = data.public_flags ?? 0;

        if ('avatar' in data) {
            this.avatar = data.avatar;
        }
        if ('banner' in data) {
            this.banner = data.banner;
        }
        if ('accent_color' in data) {
            this.accent_color = data.accent_color;
        }
    }

}
