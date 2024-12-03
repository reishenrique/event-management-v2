import { StatusCodes } from 'http-status-codes';
import { CacheStrategiesEnum } from '../infraestructure/cache/enum/CacheStrategiesEnum';
import type { CacheService } from '../infraestructure/cache/service/cacheService';
import type { Request, Response } from 'express'
import { CustomError } from '../domain/errors/customError';

interface ICacheController {
    clearCache(req: Request, res: Response): Promise<object>
}

export class CacheController implements ICacheController {
    constructor(private readonly cacheService: CacheService) {
        this.clearCache = this.clearCache.bind(this)
    }

    async clearCache(req: Request, res: Response): Promise<object> {
        const strategy = req.params.strategy as CacheStrategiesEnum

        try {
            if (!Object.values(CacheStrategiesEnum).includes(strategy)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: 'Invalid Strategy'
                })
            }

            await this.cacheService.clearAllCacheValues(strategy)
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                message: 'Cache cleared successfully',
            })
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message
                })
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Internal Server Error'
            })
        }
    }
}