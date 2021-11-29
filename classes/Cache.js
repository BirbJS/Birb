const CacheError = require("./errors/CacheError");
const CacheWarning = require("./errors/CacheWarning");
const PossibleMemoryLeakWarning = require("./errors/PossibleMemoryLeakWarning");

/**
 * The Cache class is used to store data in memory, usually
 * to reduce the amount of requests to Discord.
 * 
 * @class Cache
 * @public
 */
class Cache {

    cache = new Map();
    options = {
        maxAge: null,
        maxSize: null,
        checkPeriod: 30,
        removeOldestFirst: true,
    }

    /**
     * Create a new cache.
     * 
     * @param {Object} [options] The options for the cache.
     * @param {number} [options.maxAge=null] The maximum age of values.
     * @param {number} [options.maxSize=null] The maximum amount of values to store.
     * @param {number} [options.checkPeriod=30] The time between checks in seconds.
     * @param {boolean} [options.removeOldestFirst=true] Whether or not to, when the cache is full, remove the oldest value to make space for the new entry.
     * 
     * @constructor
     * @public
     */
    constructor (options) {
        this.options = validateOptions(options || {});
    }

    /**
     * Get a value from the cache.
     * 
     * @param {String} key The key to get the value from.
     * @returns {any} The value of the key or null if it doesn't exist.
     * 
     * @public
     */
    get (key) {
        let find = this.cache.find(e => e.k === key).v;
        return find || null;
    }

    /**
     * Set a value in the cache, or add it if it doesn't
     * already exist.
     * 
     * @param {String} key The key you're setting.
     * @param {any} value The value you're setting the key to.
     * @param {Object} [options] The options for the cache.
     * @param {number} [options.allowOverflow=false] Whether or not to force the cache to accept the new entry by adding 1 to the maximum size. Can cause memory leaks and will emit the PossibleMemoryLeakWarning warning.
     * @param {boolean} [options.removeOldest] Whether or not to remove the oldest entry if the cache is full. If not set, the default option for this cache will be used (options.removeOldestFirst).
     * @returns {Cache} The updated cache.
     * 
     * @public
     */
    set (key, value, options) {
        let entry = {
            a: Math.ceil(Date.now() / 1000),
            k: key,
            v: value,
        }
        if (this.has(key)) {
            this.remove(key);
        }
        this.makeSpace(options);
        this.cache.push(entry);
        return this;
    }

    /**
     * Check if a key exists in the cache.
     * 
     * @param {String} key The key you're checking.
     * @returns {boolean} Whether the key was set or not.
     * 
     * @public
     */
    has (key) {
        return this.cache.find(e => e.k === key);
    }

    /**
     * Remove a key from the cache.
     * 
     * @param {String} key The key you're removing.
     * @returns {Cache} The updated cache.
     * 
     * @public
     */
    remove (key) {
        // find the entry and remove it
        let index = this.cache.findIndex(e => e.k === key);
        if (index !== -1) {
            this.cache.splice(index, 1);
        }
        return this;
    }

    /**
     * Clear the entire cache and its contents.
     * 
     * @returns {Cache} The now empty cache.
     * 
     * @public
     */
    clear () {
        this.cache = [];
        return this;
    }

    /**
     * Make space for another entry in the cache.
     * 
     * @param {Object} [options] The options for the cache.
     * @param {number} [allowOverflow=false] Whether or not to force the cache to accept the new entry by adding 1 to the maximum size. Can cause memory leaks and will emit the PossibleMemoryLeakWarning warning.
     * @param {boolean} [removeOldest] Whether or not to remove the oldest entry if the cache is full. If not set, the default option for this cache will be used (options.removeOldestFirst).
     * @returns {void}
     * 
     * @public
     */
    makeSpace (options) {
        options = options || {};
        options.allowOverflow = options.allowOverflow || false;
        options.removeOldest = options.removeOldest || this.options.removeOldestFirst || false;
        if (this.options.maxSize && this.cache.length >= this.options.maxSize) {
            if (options.allowOverflow) {
                this.options.maxSize++;
                console.warn(new PossibleMemoryLeakWarning().short());
                console.warn(new CacheWarning('cache overflow detected and allowed by method options: this may lead to a memory leak'));
            } else if (options.removeOldest) {
                this.cache.shift();
            } else {
                throw new CacheError('cannot write to cache; no available resolution provided in makeCache.options; cache is full');
            }
        }
    }

    /**
     * Convert the cache to a (very long) string.
     * 
     * @returns {String} The cache as a string.
     * 
     * @public
     * @override
     */
    toString () {
        let string = '';
        for (let i = 0; i < this.cache.length; i++) {
            string += JSON.stringify(`[${i}:${JSON.stringify(this.cache[i])}],`);
        }
        return `Cache{${string}}`;
    }

}

function validateOptions (options) {
    options = options || {};
    finished = {};
    
    if (options.maxAge) {
        if (typeof options.maxAge !== 'number') {
            throw new CacheError('options.maxAge must be a number');
        }
        if (options.maxAge < 0) {
            throw new CacheError('options.maxAge must be a positive number');
        }
        if (options.maxAge % 1 !== 0) {
            throw new CacheError('options.maxAge must be a whole number');
        }
        finished.maxAge = options.maxAge;
    }

    if (options.maxSize) {
        if (typeof options.maxSize !== 'number') {
            throw new CacheError('options.maxSize must be a number');
        }
        if (options.maxSize < 0) {
            throw new CacheError('options.maxSize must be a positive number');
        }
        if (options.maxSize % 1 !== 0) {
            throw new CacheError('options.maxSize must be a whole number');
        }
        finished.maxSize = options.maxSize;
    }

    if (options.checkPeriod) {
        if (typeof options.checkPeriod !== 'number') {
            throw new CacheError('options.checkPeriod must be a number');
        }
        if (options.checkPeriod < 0) {
            throw new CacheError('options.checkPeriod must be a positive number');
        }
        if (options.checkPeriod % 1 !== 0) {
            throw new CacheError('options.checkPeriod must be a whole number');
        }
        finished.checkPeriod = options.checkPeriod;
    }

    if (options.removeOldestFirst !== undefined) {
        if (typeof options.removeOldestFirst !== 'boolean') {
            throw new CacheError('options.removeOldestFirst must be a boolean');
        }
        finished.removeOldestFirst = options.removeOldestFirst;
    }

    return finished;
}

/**
 * Convert the cache to a (very long) string.
 * 
 * @returns {String} The cache as a string.
 * 
 * @public
 * @override
 */
function fromString (string) {
    let cache = new Cache();
    let entries = string.split(',');
    for (let i = 0; i < entries.length; i++) {
        let entry = JSON.parse(entries[i]);
        cache.cache.push(entry);
    }
    return cache;
}

module.exports = Cache;
