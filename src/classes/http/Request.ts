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
                'User-Agent': `Birb (+https://birb.js.org)`,
            });

        if (this.body) {
            req.header('Content-Type', 'application/json; charset=utf-8');
            req.body(this.body);
        }

        if (this.reason) {
            req.header('X-Audit-Log-Reason', this.reason);
        }

        let res = await req.send();
        let body = res.json();
        return body;
    }

}

export class Errors {



}
