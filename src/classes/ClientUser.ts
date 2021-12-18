/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActivityStatus } from '../util/Types';
import { ActivityType } from '../util/Constants'
import BaseUser from './BaseUser';
import Client from './Client';
import HTTPUser from './http/HTTPUser';
import OptionError from '../errors/OptionError';

export default class ClientUser extends BaseUser {

    /**
     * The ClientUser represents the user that is logged in
     * to the client.
     * 
     * @param {Client} client The client this user belongs to.
     * @param {any} data The data of this user.
     */
    constructor (client: Client, data: any) {
        super(client, data);
        this.bot = true;
        this.system = false;
        Object.freeze(this.bot);
        Object.freeze(this.system);
        this.build(data);
    }

    /**
     * Builds the ClientUser.
     * 
     * @param {any} data The data of this user.
     * @returns {ClientUser} The ClientUser.
     */
    private build (data: any): ClientUser {
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
            this.accentColor = data.accent_color;
        }

        return this;
    }

    /**
     * Updates the User's presence (or status).
     * 
     * @param {object} [options] The options to use when updating the status.
     * @param {ActivityStatus} [options.status='online'] The status to set.
     * @param {boolean} [options.afk=false] Whether or not the user is AFK.
     * @param {object} [options.activity=null] The activity to set.
     * @param {string} options.activity.name The name of the activity.
     * @param {ActivityType} options.activity.type The URL of the activity.
     * @returns {void} Voids once the packet is sent to Discord.
     */
    updatePresence (options: {
        status?: ActivityStatus,
        afk?: boolean,
        activity?: {
            name: string,
            type: ActivityType,
        } | null
    } = {}): void {
        if (!options.activity) options.activity = null;
        this.client.ws.send({
            op: 3,
            d: {
                status: options.status ?? 'online',
                afk: options.afk ?? false,
                activities: options.activity ? [options.activity] : null,
                since: options.afk ? Date.now() : null,
            },
        });
    }

    /**
     * Set the username of the user.
     * 
     * @param {string} username The new username.
     * @returns {Promise<void>} Resolves once the username is set.
     */
    async setName (name: string): Promise<void> {
        if (name === undefined) {
            throw new OptionError('name [at 0] must be provided');
        }
        if (typeof name !== 'string') {
            throw new OptionError('name [at 0] must be a string with a length of at least 1 character');
        }
        await HTTPUser.modifyCurrent(this.client, { username: name });
    }

}
