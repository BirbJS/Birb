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

const InternalClient = require('./InternalClient');
const ClientOptions = require('./ClientOptions');
const ClientCaches = require('./ClientCaches');
const ClientWebsocket = require('./websocket/ClientWebsocket');
const AlreadyBoundWarning = require('./errors/AlreadyBoundWarning');
const Guild = require('./Guild');
const ClientInitializationError = require('./errors/ClientInitializationError');
const Intents = require('./Intents');

/**
 * The Client class is the main entry point for Birb.JS. It
 * is used by the end user to connect to Discord, receive
 * events, and send some commands to the Discord API.
 * 
 * @class Client
 * @public
 */
class Client {

    _internal = new InternalClient();
    socket = null;
    token = null;
    options = null;
    caches = new ClientCaches();

    /**
     * Create a new client instance.
     * 
     * @param {Object} options The options to use when creating the client.
     * @param {Intents} options.intents The intents to use when connecting to Discord.
     * @param {String} [options.cdnDomain=cdn.discord.com] The CDN domain to use for assets and media.
     * @param {String} [options.inviteDomain=discord.gg] The domain to use for server and group DM invites.
     * @param {String} [options.gatewayVersion=9] The version of the gateway to use.
     * @param {Boolean} [options.debug=false] Whether or not to log debug information to the console (spammy).
     * @returns {Client} - The newly created client.
     * 
     * @constructor
     * @public
     */
    constructor (options) {
        options = options || {};

        if (!options.intents) {
            throw new ClientInitializationError('options.intents must be provided');
        }
        if (!(options.intents instanceof Intents)) {
            throw new ClientInitializationError('options.intents must be an instance of Intents');
        }

        this.options = new ClientOptions(options);
    }

    /**
     * Get (or fetch) a guild. If one cannot be found in
     * the cache, it will be fetched from Discord.
     * 
     * @param {String} id The ID of the guild to get.
     * @param {Boolean} [force=false] Whether or not to force Birb.JS to fetch the guild from Discord.
     * @returns {Guild} The guild with the given ID.
     * 
     * @public
     */
    async fetchGuild (id, force) {
        let guild = new Guild(this, id, true);
        guild = await guild.fetch();
        return guild;
    }

    /**
     * Bind an event to a function.
     * 
     * @param {String} event The event to bind to.
     * @param {Function} listener The function to bind to the event.
     * @returns {void}
     * 
     * @public
     */
    on (event, listener) {
        if (this._internal.isEventBound(event)) {
            console.warn(new AlreadyBoundWarning(event));
        }
        this._internal.bindEvent(event, listener);
    }

    /**
     * Remove an event listener added using `Guild.on()`.
     * 
     * @param {String} event The event unbind.
     * @returns {void}
     * 
     * @public
     */
    unbind (event) {
        this._internal.unbindEvent(event);
    }

    /**
     * Emit an event.
     * 
     * @param {String} event The event emit.
     * @param {any} args The arguments to pass to the event.
     * @returns {void}
     * 
     * @public
     */
    emit (event, ...args) {
        this._internal.emitEvent(event, ...args);
    }

    /**
     * Connect to the Discord API Gateway.
     * 
     * @param {String} token Your bot's token.
     * @returns {void}
     * 
     * @public
     */
    connect (token) {
        this.token = token;
        this.socket = new ClientWebsocket(this, this.options.gatewayDomain, this.options.gatewayVersion, token);
        this.socket.connect();
    }

    /**
     * Log debug information to the console.
     * 
     * @param {String} message The message to log.
     * @returns {void}
     * 
     * @public
     */
    debug (...message) {
        if (this.options.debug) {
            console.debug('[debug]', ...message);
        }
    }

}

module.exports = Client;
