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

export default class BaseUser {
    
    /**
     * The client this user belongs to.
     */
    client: Client = null!;
    /**
     * The ID of this user.
     */
    readonly id: string;
    /**
     * The username of this user.
     */
    username: string = null!;
    /**
     * The discriminator of this user.
     */
    discriminator: string = null!;
    /**
     * The tag of this user.
     */
    tag: string = null!;
    /**
     * The avatar hash of this user.    
     * **Note**: This is not the same as an avatar URL. 
     * Use `BaseUser#displayAvatarURL()` method to get the avatar URL of this user.
     */
    avatar: string | null = null;
    /**
     * Whether or not this user is a bot.
     */
    bot: boolean = false;
    /**
     * Whether or not this user is a system account.
     */
    system: boolean = false;
    /**
     * The banner hash of this user.    
     * **Note:** This is not the same as an banner URL. 
     * Use `BaseUser#getBanner()` method to get the banner URL of this user.
     */
    banner: string | null = null;
    /**
     * The accent color of this user represented as a hex color code string.
     */
    accentColor: string | null = null;
    /**
     * The flags of this user.
     */
    flags: string | null = null;

    /**
     * A BaseUser is a model user that is not a partial
     * user. It is extended upon by the `User` and
     * `ClientUser` classes.
     * 
     * @param {Client} client The client that this user belongs to.
     * @param {any} data The data to use to build this user.
     */
    constructor (client: Client, data: any) {
        this.client = client;
        this.id = data.id;
    }

    /**
     * Whether or not this instance is a full or partial
     * user. A partial user is a user that is only
     * guaranteed to have `id` set on them.
     * 
     * @returns {boolean} `true` if this is a partial user, `false` otherwise.
     */
    isPartial (): boolean {
        return false;
    }

}
