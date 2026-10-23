import { CacheService } from './service/cacheService'
import NodeCacheStrategy from './cacheStrategy/nodeCacheStrategy'

/**
 * Single cache instance shared by every route. Creating a new strategy per
 * route file would produce independent caches that cannot be invalidated or
 * cleared from a single place.
 */
export const cacheService = new CacheService(new NodeCacheStrategy())
