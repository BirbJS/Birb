/*
    Copyright (C) 2021, knokbak and contributors

    https://github.com/knokbak/Birb

    This Source Code Form is subject to the terms of the
    Mozilla Public License, v. 2.0. If a copy of the MPL
    was not distributed with this file, You can obtain one
    at https://mozilla.org/MPL/2.0/.

    This Source Code Form is “Incompatible With Secondary
    Licenses”, as defined by the Mozilla Public License, v.
    2.0.
*/

const Package = require('../../package.json');
const petitio = require('petitio');
const HTTPErrors = require('../../utils/httpErrors');

class Request {

    client = null;
    method = null;
    url = null;
    body = null;
    reason = null;
    response = null;

    constructor (client, method, path, body) {
        this.client = client;
        this.method = method;
        this.url = `https://discord.com/api/v9${path}`;
        this.body = body || null;
    }

    async make () {
        let req = petitio(this.url, this.method)
            .timeout(5000)
            .header({
                'Authorization': `Bot ${this.client.token}`,
                'User-Agent': `Birb/${Package.version} (+https://birb.js.org)`,
            });

        if (this.body) {
            req.header('Content-Type', 'application/json');
            req.body(this.body);
        }

        if (this.reason) {
            req.header('X-Audit-Log-Reason', this.reason);
        }

        let res = await req.send();
        let body = res.json();

        if (res.statusCode > 299 || body.code > 299) {
            if (HTTPErrors[res.statusCode || body.code]) {
                throw HTTPErrors[`${res.statusCode || body.code}`](body);
            } else {
                throw HTTPErrors['500'](body);
            }
        }

        return body;
    }

}

module.exports = Request;
