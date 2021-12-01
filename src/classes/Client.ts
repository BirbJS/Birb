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
import GuildBlock from './blocks/GuildBlock';
import Intents from './Intents';
import Websocket from './websocket/Websocket';

export default class Client {

    token: string = null!;
    ws: Websocket = null!;
    guilds: GuildBlock = null!;
    options = {
        intents: null!,
        debug: true,
    }

    private events: any = {};

    constructor (options: any = {}) {
        if ('intents' in options) {
            if (!(options.intents instanceof Intents)) {
                throw new ClientError('intents must be an instance of Intents\nMore info: https://birb.js.org/explained/intents');
            }
            if (options.intents.isEmpty()) {
                throw new ClientError('intents must have at least one flag set\nMore info: https://birb.js.org/explained/intents');
            }
        } else {
            throw new ClientError('intents must be provided\nMore info: https://birb.js.org/explained/intents');
        }
        this.options = Object.assign(this.options, options);
        this.guilds = new GuildBlock(this);
    }

    /**
     * Add an event listener.
     * 
     * @param {string} event The event name.
     * @param {Function} listener The function to call when the event is emitted.
     * @returns {void}
     */
    on (event: string, callback: Function): void {
        if (this.events[event] !== undefined) {
            process.emitWarning(new ClientWarning('binding to an event multiple times is not supported: previous listener overwritten'));
        }
        this.events[event] = callback;
    }

    /**
     * Undind an event listener.
     * 
     * @param {string} event The event name to unbind.
     * @returns {void}
     */
    unbind (event: string): void {
        delete this.events[event];
    }

    /**
     * Emit an event.
     * 
     * @param {string} event The event name.
     * @param {any} data The event data to pass to the listener.
     * @returns {void}
     */
    emit (event: string, ...args: any[]): void {
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

}
