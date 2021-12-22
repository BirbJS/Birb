import Client from '../Client';
import Cache from '../cache/Cache';

export default abstract class CachedBlock {

    /**
     * The client that initilized this block.
     */
    client: Client = null!;
    /**
     * This block's cache.
     */
    cache: Cache = null!;

    /**
     * A CachedBlock is the base class for all blocks that
     * cache data.
     * 
     * @param {Client} client The client to use.
     * @param {Cache} cache The cache to use.
     */
    constructor (client: Client, cache: Cache) {
        this.client = client;
        this.cache = cache;
    }

}
