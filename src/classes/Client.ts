/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

let Sharding: any;

import ClientError from '../errors/ClientError';
import ClientWarning from '../errors/ClientWarning';
import OptionError from '../errors/OptionError';
import { EventResolvable } from '../util/Types';
import GuildBlock from './blocks/GuildBlock';
import UserBlock from './blocks/UserBlock';
import ClientUser from './ClientUser';
import Intents from './Intents';
import Websocket from './websocket/Websocket';

try {
    Sharding = require('@birbjs/sharding');
} catch (e) {
    Sharding = null;
}

export default class Client {

    private valid = true;
    token: string = null!;
    ws: Websocket = null!;
    me: ClientUser | null = null;
    shard: any = null;
    options = {
        intents: <Intents>null!,
        debug: false,
    }

    readonly guilds: GuildBlock;
    readonly users: UserBlock;
    
    private events: any = {};

    constructor (options: {
        intents: Intents,
        debug?: boolean,
    }) {
        options = options || {};
        if ('intents' in options) {
            if (!(options.intents instanceof Intents)) {
                throw new OptionError('intents must be an instance of Intents\nMore info: https://birb.js.org/explained/intents');
            }
            if (options.intents.isEmpty()) {
                throw new OptionError('intents must have at least one flag set\nMore info: https://birb.js.org/explained/intents');
            }
        } else {
            throw new OptionError('intents must be provided\nMore info: https://birb.js.org/explained/intents');
        }
        this.options = Object.assign(this.options, options);
        this.guilds = new GuildBlock(this);
        this.users = new UserBlock(this, {
            maxSize: 250000,
            removeOldest: true,
        });

        if (Sharding && process.env.BIRB_IS_SHARD == 'true') {
            this.warn('sharding is enabled');
            this.debug(`shard id: ${process.env.BIRB_SHARD_NUMBER}`);
            this.debug(`total shards: ${process.env.BIRB_TOTAL_SHARDS}`);
            this.shard = new Sharding.Shard(this);
        }
    }

    /**
     * Add an event listener.
     * 
     * @param {EventResolvable | string} event The event name.
     * @param {Function} listener The function to call when the event is emitted.
     * @returns {void}
     */
    listen (event: EventResolvable | string, callback: Function): void {
        if (!this.valid) {
            throw new ClientError('the client has been invalidated; please restart the process');
        }
        if (this.events[event] !== undefined) {
            process.emitWarning(new ClientWarning('binding to an event multiple times is not supported: previous listener overwritten'));
        }
        this.events[event] = callback;
    }

    /**
     * Undind an event listener.
     * 
     * @param {EventResolvable | string} event The event name to unbind.
     * @returns {void}
     */
    unbind (event: EventResolvable | string): void {
        if (!this.valid) throw new ClientError('the client has been invalidated; please restart the process');
        delete this.events[event];
    }

    /**
     * Emit an event.
     * 
     * @param {EventResolvable | string} event The event name.
     * @param {any} data The event data to pass to the listener.
     * @returns {void}
     */
    emit (event: EventResolvable | string, ...args: any[]): any {
        if (this.events[event] == undefined || !this.valid) return;
        return this.events[event](...args);
    }

    /**
     * Connect to the Discord gateway.
     * 
     * @param {string} token Your bot's token.
     * @returns {void}
     */
    connect (token: string): void {
        if (!this.valid) throw new ClientError('the client has been invalidated; please restart the process');
        this.token = token;
        this.ws = new Websocket(this, 'gateway.discord.gg');
        this.ws.connect();
    }

    /**
     * Emit a log in debug mode.
     * 
     * @param {any} message The log message.
     * @returns {void}
     */
    debug (...message: any[]): void {
        if (this.options.debug) console.debug('[debug]', ...message);
    }

    /**
     * Emit a warning in debug mode.
     * 
     * @param {any} message The warning message.
     * @returns {void}
     */
    warn (...message: any[]): void {
        if (this.options.debug) console.warn('[warn]', ...message);
    }

    /**
     * Only registers the provided event if it isn't
     * already registered.
     */
    private listenIfNotRegistered (event: EventResolvable, callback: Function): void {
        if (this.events[event] == undefined) this.listen(event, callback);
    }

    /**
     * Invalidate the client, forcing the user to restart
     * the process to use it. Once called, this cannot be
     * undone (mostly because it would defeat the entire
     * purpose of this function).
     */
    private invalidate (): void {
        this.events = {};
        this.valid = false;
        Object.freeze(this.valid);
        console.error(new ClientError('the Birb.JS client has been invalidated; please restart the process'));
    }

}
