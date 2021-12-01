import Client from '../Client';
import Cache from '../Cache';

export default abstract class CachedBlock {

    client: Client = null!;
    cache: Cache = null!;

    constructor (client: Client, cache: Cache) {
        this.client = client;
        this.cache = cache;
    }

}
