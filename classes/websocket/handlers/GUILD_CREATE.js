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
    ws.setStatus(Status.WAITING_FOR_GUILDS);
    if (ws.status === Status.WAITING_FOR_GUILDS) {
        client.debug(`received guild: ${data.id}`);
        ws.expectedGuilds.delete(data.id);
        if (ws.expectedGuilds.size === 0) {
            client.debug(`we've received all guilds; setting to ready`);
            ws.setStatus(Status.READY);
            client.emit('ready');
        }
    }
}
