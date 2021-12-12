/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ShardChild from './ShardChild';
import petitio from 'petitio';
import Crypit from 'crypit';

/**
 * The ShardMaster is used to dynamically manage and spawn
 * shards (which are child processes). To provide info to a
 * shard about it's environment, the ShardMaster should use
 * environment variables. After the shard is spawned,
 * continious communication between the ShardMaster and the
 * shard is done through the IPC channel. Shards interact
 * with the ShardMaster through methods on their own Shard
 * class (which ultimately just sends JSON IPC messages).
 */
export default class ShardMaster {

    token: string = null!;
    totalShards: number = 1;
    apiVersion: number = null!;
    modulePath: string = null!;
    children: ShardChild[] = [];
    crypit: Crypit = null!;
    private events: {
        [event: string]: (...args: any[]) => any
    } = {};

    /**
     * 
     * @param {string} pathToIndex The path to your bot's main file
     * @param {object} options The sharding options
     * @param {number} options.token Your bot's token (this is required)
     * @param {number} [options.apiVersion=9] The Discord API version to use
     */
    constructor (pathToIndex: string, options: {
        token: string,
        apiVersion?: number,
    }) {
        this.modulePath = pathToIndex;
        this.token = options?.token;
        this.apiVersion = options?.apiVersion ?? 9;
        this.crypit = new Crypit();
    }

    /**
     * Start the automatic spawning process.
     */
    async start () {
        let req = petitio(`https://discord.com/api/v${this.apiVersion}/gateway/bot`, 'GET')
            .timeout(10000)
            .header({
                'Authorization': `Bot ${this.token}`,
                'User-Agent': `DiscordBot (https://birb.js.org, ${require('../../package.json').version})`,
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json',
            });
        let res = await req.send();
        let bot = res.json();
        if (!bot || !bot.shards) throw new Error('sharding failed; couldn\'t get recommended shard count from Discord');
        this.totalShards = bot.shards;
        for ( let i = 0; i < this.totalShards; ++i ) {
            await this.spawn(i);
        }
    }

    async spawn (shard: number) {
        let child = new ShardChild(this, shard);
        this.children.push(child);
        await child.start();
        return child;
    }

    listen (event: string, listener: (...args: any[]) => any) {
        this.events[event] = listener;
    }

    emit (event: string, ...args: any[]) {
        if (this.events[event]) this.events[event](...args);
    }

    protected shardToShardBroadcast (shard: ShardChild, data: { [key: string]: any }) {
        for ( let child of this.children ) {
            if (child.number === shard.number) continue;
            child.send(data);
        }
    }

}
