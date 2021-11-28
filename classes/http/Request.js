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
const fetch = require('node-fetch');

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
        this.url = `https://discord.com/api/v9/${path}`;
        this.body = body || null;
    }

    async make () {
        let url = this.url;
        let request = {
            method: this.method,
            headers: {
                'Authorization': `Bot ${this.client.token}`,
                'User-Agent': `Birb/${Package.version} (+https://github.com/knokbak/Birb)`,
            }
        }

        if (this.reason) {
            request.headers['X-Audit-Log-Reason'] = this.reason;
        }

        if (this.body) {
            request.body = this.body;
            request.headers['Content-Type'] = 'application/json';
        }

        try {
            let res = await new Promise((resolve, reject) => {
                fetch(url, request)
                    .then(async (res) => {
                        resolve({
                            status: res.status,
                            body: await res.json(),
                        })
                    })
                    .catch(reject);
            });
            this.response = res;
            return res;
        } catch (e) {
            throw e;
        }
    }

}

module.exports = Request;
