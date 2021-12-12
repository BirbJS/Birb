/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ShardMaster from './ShardMaster';
import { ChildProcess, fork } from 'child_process';

/**
 * The ShardChild is just a class to make it easier for the
 * ShardMaster do perform actions on individual shards.
 */
export default class ShardChild {

    master: ShardMaster = null!;
    number: number = null!;
    process: ChildProcess | null = null;
    private events: {
        [key: string]: (...args: any[]) => any;
    } = {};

    constructor (master: ShardMaster, shardNumber: number) {
        this.master = master;
        this.number = shardNumber;
    }

    async start (): Promise<void> {
        this.process = fork(this.master.modulePath, {
            env: {
                BIRB_IS_SHARD: 'true',
                BIRB_SHARD_NUMBER: this.number.toString(),
                BIRB_COMMUNICATE_VIA: 'ipc',
            }
        });
        this.process.on('message', this.onMessage.bind(this));
        this.process.on('exit', this.onExit.bind(this));
    }

    listen (event: string, callback: (...args: any[]) => any): void {
        this.events[event] = callback;
    }

    emit (event: string, ...args: any[]): void {
        if (this.events[event]) this.events[event](...args);
    }

    /**
     * Send an IPC message to the shard's child process.
     * 
     * @param {any} data The data to send.
     */
    send (data: { [key: string]: any }) {
        if (this.process) this.process.send(data);
    }

    private onMessage (message: {
        event: string,
        data: {
            [key: string]: any;
        }
    }): void {
        switch (message.event) {
            case 'BIRB_BROADCAST_EVAL':
                this.master['shardToShardBroadcast'](this, {
                    event: 'BIRB_EVAL',
                    messageId: message.data.messageId,
                    eval: message.data.eval,
                });
                break;
            default:
                this.emit(message.event, message.data);
        }
    }

    private onExit (code: number, signal: string): void {
        this.process = null;
        this.emit('exit', code, signal);
    }

}
