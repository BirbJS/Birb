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

const Guilds = require('./http/Guilds');
const HTTPErrors = require('../utils/HTTPErrors');
const ParsingError = require('./errors/ParsingError');

class Guild {

    client = null;
    id = null;
    name = null;
    icon = null;
    description = null;
    splash = null;
    discoverySplash = null;
    approximateMemberCount = null;
    approximatePresenceCount = null;
    features = null;
    emojis = null;
    banner = null;
    ownerId = null;
    applicationId = null;
    afkChannelId = null;
    afkTimeout = null;
    systemChannelId = null;
    verificationLevel = null;
    roles = null;
    defaultMessageNotifications = null;
    mfaLevel = null;
    explicitContentFilter = null;
    maxPresences = null;
    maxMembers = null;
    maxVideoChannelUsers = null;
    vanityUrlCode = null;
    premiumTier = null;
    premiumSubscriberCount = null;
    systemChannelFlags = null;
    preferredLocale = null;
    rulesChannelId = null;
    publicUpdatesChannelId = null;
    available = false;

    constructor (client, id, fetch) {
        this.client = client;
        this.id = id;
    }

    async setName (name, reason) {
        return await this.modify({ name }, reason);
    }

    async setDescription (description, reason) {
        return await this.modify({ description }, reason);
    }

    async getIconURL (options) {
        let format = options.format || 'png';
        return `https://${client.options.cdnDomain}/icons/${this.id}/${this.icon}.${format.toLowerCase()}`;
    }

    async modify (data, reason) {
        let request = new Guilds.Modify(this.client, this.id, data, reason);
        return await request.make();
    }

    async fetch () {
        let request = new Guilds.Get(this.client, this.id);
        let result = await request.make();

        if (result.status > 299 || result.body.code > 299) {
            if (HTTPErrors[result.status || result.body.code]) {
                throw HTTPErrors[`${result.status || result.body.code}`](result.body);
            } else {
                throw HTTPErrors['500'](result.body);
            }
        }

        let translated = translateGuild(result.body);

        for ( let key in translated ) {
            this[key] = translated[key];
        }

        return this;
    }

    toString () {
        return `Guild{${this.id}}`;
    }

}

Guild.fromString = function (client, str) {
    if (!str.startsWith('Guild{') || !str.endsWith('}')) {
        throw new ParsingError('invalid guild string provided');
    }
    let parsed = str.substring(6, str.length - 1);
    return new Guild(client, parsed);
}

function translateGuild (guild) {
    let result = {};

    // how does this work? no fucking clue. github copilot made it.
    for ( let key in guild ) {
        let newKey = key.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
        result[newKey] = guild[key];
    }

    if (result.roles) {
        for ( let role of result.roles ) {
            if (role.id === result.id) {
                role.everyone = true;
            }
        }
    }

    if (result.unavailable !== undefined) {
        result.available = !result.unavailable;
    }

    return result;
}

module.exports = Guild;
