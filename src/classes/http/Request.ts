/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import petitio, { HTTPMethod } from 'petitio';
import { inspect } from 'util';
import DiscordAPIError from '../../errors/DiscordAPIError';
import Client from '../Client';

export default class Request {

    client: Client = null!;
    method: HTTPMethod = null!;
    url: string = null!;
    body: any = null!;
    reason: string | null = null;
    response: any | null = null;

    constructor (client: Client, method: HTTPMethod, path: string, body?: any) {
        this.client = client;
        this.method = method;
        this.url = `https://discord.com/api/v9${path}`;
        this.body = body ?? null;
    }

    async make () {
        let req = petitio(this.url, this.method)
            .timeout(5000)
            .header({
                'Authorization': `Bot ${this.client.token}`,
                'User-Agent': `DiscordBot (https://birb.js.org, ${require('../../package.json').version}, ${process.platform})`,
            });

        if (this.body) {
            req.header('Content-Type', 'application/json; charset=utf-8');
            req.body(this.body);
        }

        if (this.reason) req.header('X-Audit-Log-Reason', this.reason);

        let res;
        let body;
        
        try {
            res = await req.send();
            body = res.json();
        } catch (err) {
            console.error(err);
            throw new DiscordAPIError(`failed to make ${this.method} request to ${this.url}`);
        }

        if (body && body.code !== undefined) {
            console.log(inspect(body, { depth: null }));
            this.client.warn(`[${this.method}:${this.url}] ${body.code} -> ${inspect(body)}`);
            throw new DiscordAPIError(`[${this.method}:${this.url}] ${body.code}: ${translateError(body.code, body.message)}`);
        }

        if (!res.statusCode || res.statusCode > 299) {
            this.client.warn(`[${this.method}:${this.url}] ${res.statusCode}`);
            throw new DiscordAPIError(`encountered HTTP error ${res.statusCode} whilst sending ${this.method} request to ${this.url}`);
        }

        this.client['logHttp'](`${this.method} to ${this.url} -> ${JSON.stringify(body ?? '<no body>')}`);

        return body;
    }

}

export function translateError (code: number, message?: string) {
    if (!message) return 'internal Discord API Error (not your fault)';

    if (code == 50013) return `Missing Permissions: your bot does not have permission to perform this action; ensure at least one of its roles has the permissions required`;
    else return message;
}
