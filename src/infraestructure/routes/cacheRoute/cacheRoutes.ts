import { Router } from 'express'
import verifyToken from '../../middlewares/authorization'
import { CacheController } from '../../../controllers/cacheController'
import { cacheService } from '../../cache/cacheInstance'

const cacheRoutes = Router()

const cacheController = new CacheController(cacheService)

cacheRoutes.post(
  '/cache/clear/:strategy?',
  verifyToken,
  cacheController.clearCache,
)

export default cacheRoutes
