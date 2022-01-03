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
import User from './User';

export default class PartialUser {

    client: Client = null!;
    readonly id: string;
    username: string = null!;
    discriminator: string = null!;
    tag: string = null!;

    /**
     * **Warning:** Only the `id` property is guaranteed to be
     * set. Run the `fetch()` method to retrieve the entirety
     * of the User from the Discord API. If the username and/or
     * discriminator are not provided, they will be set to
     * `Unknown` and `0000` respectively.
     * 
     * @param {Client} client The client this user belongs to.
     * @param {any} data The data of this user.
     */    
    constructor (client: Client, data: any) {
        this.client = client;
        this.id = data.id;
        this.build(data);
    }

    /**
     * Build the data of this user.
     * 
     * @param {any} data The data of this user.
     * @returns {PartialUser} This user.
     */
    private build (data: any): PartialUser {
        this.username = data.username ?? 'Unknown';
        this.discriminator = data.discriminator ?? '0000';
        this.tag = `${this.username}#${this.discriminator}`;
        return this;
    }

    /**
     * Fetch (and resolve) this PartialUser into a User.
     * 
     * @param {Object} [options] The options to use when fetching the user.
     * @param {boolean} [options.shouldCache=true] Whether or not to cache the result.
     * @param {boolean} [options.bypassCache=true] Whether or not to bypass the cache.
     * @returns {Promise<User>} A promise that resolves with user.
     * @public
     */
    async fetch (options?: {
        shouldCache?: boolean | undefined,
        bypassCache?: boolean | undefined,
    }): Promise<User> {
        options = options ?? {};
        options.bypassCache = options.bypassCache ?? false;
        return this.client.users.fetch(this.id, options);
    }

    /**
     * Convert this User into a mention (string).
     * 
     * @returns {string} A string that mentions this user.
     */
    toString (): string {
        return `<@${this.id}>`;
    }

    /**
     * Whether or not this instance is a full or partial
     * user. A partial user is a user that is only
     * guaranteed to have `id` set on them.
     * 
     * @returns {boolean} `true` if this is a partial user, `false` otherwise.
     */
    isPartial (): boolean {
        return true;
    }

}
