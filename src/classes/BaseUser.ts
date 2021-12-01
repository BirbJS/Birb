/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Client from "./Client";

export default abstract class BaseUser {
    
    client: Client = null!;
    readonly id: string;
    username: string = null!;
    discriminator: string = null!;
    tag: string = null!;
    avatar: string | null = null;
    bot: boolean = false;
    system: boolean = false;
    banner: string | null = null;
    accent_color: string | null = null;
    flags: string | null = null;

    constructor (client: Client, data: any) {
        this.client = client;
        this.id = data.id;
    }

}
