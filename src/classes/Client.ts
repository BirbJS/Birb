/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ClientError from '../errors/ClientError';
import ClientWarning from '../errors/ClientWarning';
import OptionError from '../errors/OptionError';
import { EventResolvable } from '../util/Types';
import GuildBlock from './blocks/GuildBlock';
import UserBlock from './blocks/UserBlock';
import ClientUser from './ClientUser';
import Intents from './Intents';
import Websocket from './websocket/Websocket';

export default class Client {

    private valid = true;
    token: string = null!;
    ws: Websocket = null!;
    me: ClientUser | null = null;
    options = {
        intents: <Intents>null!,
        debug: false,
    }

    readonly guilds: GuildBlock;
    readonly users: UserBlock;
    
    private events: any = {};

    constructor (options: any = {}) {
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
    }

    /**
     * Add an event listener.
     * 
     * @param {EventResolvable} event The event name.
     * @param {Function} listener The function to call when the event is emitted.
     * @returns {void}
     */
    listen (event: EventResolvable, callback: Function): void {
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
     * @param {EventResolvable} event The event name to unbind.
     * @returns {void}
     */
    unbind (event: EventResolvable): void {
        if (!this.valid) {
            throw new ClientError('the client has been invalidated; please restart the process');
        }
        delete this.events[event];
    }

    /**
     * Emit an event.
     * 
     * @param {EventResolvable} event The event name.
     * @param {any} data The event data to pass to the listener.
     * @returns {void}
     */
    emit (event: EventResolvable, ...args: any[]): void {
        if (this.events[event] === undefined) {
            return;
        }
        this.events[event](...args);
    }

    /**
     * Connect to the Discord gateway.
     * 
     * @param {string} token Your bot's token.
     * @returns {void}
     */
    connect (token: string): void {
        if (!this.valid) {
            throw new ClientError('the client has been invalidated; please restart the process');
        }
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
        if (this.options.debug) {
            console.debug('[debug]', ...message);
        }
    }

    /**
     * Emit a warning in debug mode.
     * 
     * @param {any} message The warning message.
     * @returns {void}
     */
    warn (...message: any[]): void {
        if (this.options.debug) {
            console.warn('[warn]', ...message);
        }
    }

    /**
     * Invalidate the client, forcing the user to restart
     * the process to use it. Once called, this cannot be
     * undone (mostly because it would defeat the entire
     * purpose of this function).
     * 
     * @returns {void}
     * @public
     */
    _invalidate (): void {
        this.valid = false;
        this.events = {};
        console.error(new ClientError('the Birb.JS client has been invalidated; please restart the process'));
    }

}
