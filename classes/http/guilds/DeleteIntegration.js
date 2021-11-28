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

const Request = require("../Request");

class DeleteIntegration extends Request {

    constructor (client, guildId, integrationId, reason) {
        super(client, 'DELETE', `/guilds/${guildId}/integrations/${integrationId}`);
        this.reason = reason;
    }

}

module.exports = DeleteIntegration;
