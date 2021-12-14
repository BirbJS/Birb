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

    bot: boolean = true;
    system: boolean = false;

    constructor (client: Client, data: any) {
        super(client, data);
        this.build(data);
    }

    private build (data: any) {
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

    updatePresence (options: {
        status?: ActivityStatus,
        afk?: boolean,
        activity?: {
            name: string,
            type?: ActivityType,
        } | null
    }) {
        options = options ?? {};
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
