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

const ClientData = require('./ClientData');
const ClientWebsocket = require('./websocket/ClientWebsocket');
const AlreadyBoundWarning = require('./errors/AlreadyBoundWarning');
const WS = require('ws');
const Guild = require('./Guild');

class Client {

    _ClientData = new ClientData();
    socket = null;
    token = null;
    options = {};

    constructor (options) {
        this.options = {
            cdnURL: options.cdnDomain || 'cdn.discord.com',
            inviteURL: options.inviteDomain || 'discord.gg',
            inviteURL: options.gatewayDomain || 'gateway.discord.gg',
        }
    }

    async fetchGuild (id, force) {
        let guild = new Guild(this, id, true);
        guild = await guild.fetch();
        console.log(guild);
        return guild;
    }

    on (event, fn) {
        if (!this._ClientData.isEventBound(event)) {
            console.warn(new AlreadyBoundWarning(event));
        }
        this._ClientData.bindEvent(event, fn);
    }

    unbind (event) {
        this._ClientData.unbindEvent(event);
    }

    login (token) {
        this.token = token;
        this.socket = new ClientWebsocket(this.options.gatewayDomain, 9, token);
        this.socket.connect();
    }

}

module.exports = Client;
