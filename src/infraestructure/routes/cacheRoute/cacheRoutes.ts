import { Router } from "express";
import { CacheService } from "../../cache/service/cacheService";
import NodeCacheStrategy from "../../cache/cacheStrategy/nodeCacheStrategy";

const cacheRoutes = Router()

const nodeCacheStrategy = new NodeCacheStrategy()

const cacheService = new CacheService(nodeCacheStrategy)

cacheRoutes.post('/clear', cacheService.clearAllCacheValues)

export default cacheRoutes