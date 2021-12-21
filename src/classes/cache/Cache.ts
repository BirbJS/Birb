/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import CacheError from '../../errors/CacheError';
import MemoryLeakWarning from '../../errors/MemoryLeakWarning';
import OptionError from '../../errors/OptionError';
import Pair from '../../util/Pair';
import Client from '../Client';

export default abstract class Cache {

    /**
     * The Client that initialized this cache.
     */
    abstract client: Client;
    /**
     * The Cache's map (where the data is stored).
     */
    private cache = new Map<string, any>();
    /**
     * The cache's options.
     * 
     * @type {object} The options.
     * @property {number} [maxSize=null] The maximum size of the cache.
     * @property {number} [maxAge=null] The maximum age (in seconds) of the values in the cache.
     * @property {number} [checkInterval=60] The interval (in seconds) to check for old values in the cache.
     * @property {boolean} [removeOldest=true] Whether to remove the oldest values when the cache is full.
     */
    private options: {
        maxSize?: number | null,
        maxAge?: number | null,
        checkInterval?: number,
        removeOldest?: boolean,
    } = {
        maxSize: null,
        maxAge: null,
        checkInterval: 60,
        removeOldest: true,
    }

    /**
     * A Cache stores values in memory.
     * 
     * @param {object} [options] The options for the cache.
     * @param {number} [options.maxSize=null] The maximum size of the cache.
     * @param {number} [options.maxAge=null] The maximum age (in seconds) of the values in the cache.
     * @param {number} [options.checkInterval=60] The interval (in seconds) to check for old values in the cache.
     * @param {boolean} [options.removeOldest=true] Whether to remove the oldest values when the cache is full.
     */
    constructor (options?: {
        maxSize?: number,
        maxAge?: number,
        checkInterval?: number,
        removeOldest?: boolean,
    }) {
        options = options ?? {};
        if ('maxSize' in options) {
            if (typeof options.maxSize !== 'number') {
                throw new OptionError('maxSize [in options at 0] must be a number');
            }
            this.options.maxSize = options.maxSize ?? null;
        }
        if ('maxAge' in options) {
            if (typeof options.maxAge !== 'number') {
                throw new OptionError('maxAge [in options at 0] must be a number');
            }
            this.options.maxAge = options.maxAge ?? null;
        }
        if ('checkInterval' in options) {
            if (typeof options.checkInterval !== 'number') {
                throw new OptionError('checkInterval [in options at 0] must be a number');
            }
            this.options.checkInterval = options.checkInterval ?? 60;
        }
        if ('removeOldest' in options) {
            if (typeof options.removeOldest !== 'boolean') {
                throw new OptionError('removeOldest [in options at 0] must be a boolean');
            }
            this.options.removeOldest = options.removeOldest ?? true;
        }

        setInterval(() => {
            if (this.options.maxAge) {
                let removed = 0;
                for ( let [key, value] of this.cache.entries() ) {
                    if (Date.now() - value.t > this.options.maxAge) {
                        this.remove(key);
                        removed++;
                    }
                }
                if (removed > 0) this.client.debug(`garbage collected ${removed} entries from a cache`);
            }
        }, (this.options.checkInterval || 60) * 1000);
    }

    /**
     * Get a value from the cache. If the key is not found
     * in the cache, `null` is returned.
     * 
     * @param {string} key The key to get the value for.
     * @returns {any | null} The value for the key, or `null` if the key is not found.
     */
    get (key: string): any | null {
        let entry = this.cache.get(key);
        if (entry?.v) this.rebuild(entry.v);
        return entry?.v ?? null;
    }

    /**
     * Find a value in the cache. If the key is not found
     * in the cache, `null` is returned.
     * 
     * @param {string} key The key to get the value for.
     * @returns {any | null} The value for the key, or `null` if the key is not found.
     */
    find (fn: ((e: any) => boolean)): any | null {
        return this.array().find(fn);
    }

    /**
     * Filter values in the cache. If the key is not found
     * in the cache, an empty array is returned.
     * 
     * @param {string} key The key to get the value for.
     * @returns {any[]} The value for the key, or [] if the key is not found.
     */
    filter (fn: ((e: any) => boolean)): any[] {
        return this.array().filter(fn);
    }

    /**
     * Set a value in the cache.
     * 
     * @param {string} key The key of the entry.
     * @param {any} value The value to set it to.
     * @returns {Cache} The updated cache.
     */
    set (key: string, value: any, options?: any): Cache {
        let push = {
            t: Date.now(),
            v: value,
        }
        this.makeSpace(options);
        push = this.strip(push);
        this.cache.set(key, push);
        return this;
    }

    /**
     * Check if the cache contains a key.
     * 
     * @param {string} key The key of the entry.
     * @returns {boolean} `true` if the key is found, `false` otherwise.
     */
    has (key: string): boolean {
        return this.cache.has(key);
    }

    /**
     * Remove a key from the cache.
     * 
     * @param {string} key The key of the entry.
     * @returns {Cache} The updated cache.
     */
    remove (key: string): Cache {
        this.cache.delete(key);
        return this;
    }

    /**
     * Get the amount of entries in the cache.
     * 
     * @returns {number} The size of the cache.
     */
    size (): number {
        return this.cache.size;
    }

    /**
     * Get an object of the entries in the cache. The
     * key is the key of the entry, and the value is
     * the value of the entry.
     * 
     * @returns {{ [key: string]: any }} The array.
     */
    entries (): { [key: string]: any } {
        let entries: any = {};
        for ( let [key, value] of this.cache.entries() ) {
            entries[key] = this.rebuild(value.v);
        }
        return entries;
    }

    /**
     * Get an array of the entries in the cache as `Pair`s.
     * 
     * @returns {any[]} The array.
     */
    arrayPair (): any[] {
        let entries = [];
        for ( let [key, value] of this.cache.entries() ) {
            entries.push(new Pair(key, value.v));
        }
        return entries;
    }

    /**
     * Get an array of the entries in the cache.
     * 
     * @returns {Pair<string, any>[]} The array.
     */
    array (): Pair<string, any>[] {
        let entries = [];
        for ( let [, value] of this.cache.entries() ) {
            entries.push(value.v);
        }
        return entries;
    }

    /**
     * Clear the cache and its contents.
     * 
     * @returns {Cache} The updated cache.
     */
    clear (): Cache {
        this.cache.clear();
        return this;
    }

    /**
     * Make space in the cache for a new entry. You
     * **probably shouldn't** run this method directly
     * unless you know **EXACTLY** what you're doing.
     * 
     * @returns {void} Voids when completed.
     */
    makeSpace (options?: any): void {
        options = options ?? {};
        options.maxAge = options.maxAge || this.options.maxAge || null;
        options.removeOldest = options.removeOldest ?? this.options.removeOldest ?? true;
        options.allowOverflow = options.allowOverflow ?? false;
        if (this.options.maxSize && this.cache.size >= this.options.maxSize) {
            if (options.allowOverflow) {
                process.emitWarning(new MemoryLeakWarning('possible memory leak detected: overflow for cache has been permitted by options provided'));
                this.options.maxSize++;
            } else if (options.removeOldest) {
                let oldest = this.cache.entries().next().value;
                this.remove(oldest[0]);
            } else {
                throw new CacheError('cannot write to cache; cache is full');
            }
        }
    }

    /**
     * A method called to strip unwanted properties from an
     * entry before it is added to the cache.
     * 
     * @param {any} data The data to check and strip.
     * @returns {any} The updated data.
     */
    abstract strip (data: any): any;

    /**
     * A method called to rebuild data that has been
     * stripped.
     * 
     * @param {any} data The data to check and rebuild.
     * @returns {any} The rebuilt data.
     */
    abstract rebuild (data: any): any;

}
