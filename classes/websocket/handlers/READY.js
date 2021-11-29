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

const { Status } = require('../../../utils/Constants');

module.exports = (client, ws, data) => {
    client.debug(`RECEIVE: ${JSON.stringify(data)}`);
    client.debug(`discord ready`);

    ws.setStatus(Status.WAITING_FOR_GUILDS);
    ws.setSessionIdentifier(data.session_id);
    ws.expectedGuilds = new Set(data.guilds.map(d => d.id));

    if (!ws.expectedGuilds) {
        client.debug(`we didn't need to receive any guilds; marking as ready`);
        ws.setStatus(Status.READY);
        client.emit('ready');
        return;
    }
}
