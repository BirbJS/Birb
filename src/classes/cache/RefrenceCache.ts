/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Client from '../Client';
import Cache from './Cache'

export default class RefrenceCache {
    
    client: Client = null!;
    private readonly key: string;

    /**
     * A RefrenceCache references a cache that is stored on
     * the client object. Its methods directly call the
     * client's cache methods, and filters results.
     * 
     * @param {Client} client The client instance. 
     * @param {string} key The key to reference (on `client`).
     */
    constructor (client: Client, key: string) {
        this.client = client;
        this.key = key;
        Object.freeze(this.key);
    }

    /**
     * Get a value from the cache. If the key is not found
     * in the cache, `null` is returned.
     * 
     * @param {string} key The key to get the value for.
     * @returns {any | null} The value for the key, or `null` if the key is not found.
     */
    get (key: string): any | null {
        // @ts-ignore - this is really the only good way to do this
        return this.client[this.key].cache.get(key) ?? null;
    }

    /**
     * Get all the values in the cache.
     * 
     * @returns {any[]} The values. An empty array if the cache is empty.
     */
    array (): any[] {
        // @ts-ignore - this is really the only good way to do this
        return this.client[this.key].cache.array() ?? [];
    }

    /**
     * Find a value in the cache.
     * 
     * @param {(value: any) => boolean} fn The function to use to find the value.
     * @returns {any} The value. `null` if the value is not found.
     */
    find (fn: ((value: any) => boolean)): any[] {
        // @ts-ignore - this is really the only good way to do this
        return this.array().find(fn) ?? [];
    }

    /**
     * Filters the cache.
     * 
     * @param {(value: any) => boolean} fn The function to use to filter the values.
     * @returns {any} The values. An empty array if none are found.
     */
    filter (fn: ((value: any) => boolean)): any[] {
        // @ts-ignore - this is really the only good way to do this
        return this.array().filter(fn) ?? [];
    }

    /**
     * Set a value in the cache.
     * 
     * @param {string} key The key to get the value for.
     * @param {string} any The value to set.
     * @returns {RefrenceCache} This cache.
     */
    set (key: string, value: any, options?: any): RefrenceCache {
        // @ts-ignore - this is really the only good way to do this
        this.client[this.key].cache.set(key, value, options);
        return this;
    }

    /**
     * Access the direct cache object.
     * 
     * @returns {Cache} The cache object.
     */
    access (): Cache {
        // @ts-ignore - this is really the only good way to do this
        return this.client[this.key].cache;
    }

}
