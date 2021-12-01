/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import GuildError from '../errors/GuildError';
import Client from './Client';
import Color from '../util/Color';

export default class Role {
    
    client: Client = null!;
    id: string = null!;
    name: string | null = null;
    color: string | null = null;
    hoist: boolean | null = null;
    icon: string | null = null;
    managed: boolean | null = null;
    mentionable: boolean | null = null;
    permissions: string | null = null;
    position: number | null = null;
    unicodeEmoji: string | null = null;

    constructor (client: Client, data: any) {
        if (typeof data.id !== 'string') {
            throw new GuildError('invalid role data provided');
        }
        this.client = client;
        this.id = data.id;
        this._build(data);
    }

    _build (data: any): void {
        if ('name' in data) {
            this.name = data.name;
        }
        if ('color' in data) {
            let hex: string = Color.intToHex(data.color);
            this.color = hex === '00' ? hex : '000000';
        }
        if ('hoist' in data) {
            this.hoist = data.hoist;
        }
        if ('icon' in data) {
            this.icon = data.icon;
        }
        if ('managed' in data) {
            this.managed = data.managed;
        }
        if ('mentionable' in data) {
            this.mentionable = data.mentionable;
        }
        if ('permissions' in data) {
            this.permissions = data.permissions;
        }
        if ('position' in data) {
            this.position = data.position;
        }
        if ('unicode_emoji' in data) {
            this.unicodeEmoji = data.unicode_emoji;
        }
    }

}
