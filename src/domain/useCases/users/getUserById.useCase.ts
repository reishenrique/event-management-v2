import { CustomError } from '../../errors/customError'
import type { CacheService } from '../../../infraestructure/cache/service/cacheService'
import type { IUserRepository } from '../../interfaces/IUserRepository'

export class GetUserByIdUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cacheService: CacheService
  ) { }

  async execute(id?: string) {
    if (!id || typeof id !== 'string') {
      throw CustomError.BadRequestError(
        'User ID is required to proceed with the search execution',
      )
    }

    const cacheKey = `userId:${id}`

    let getUserById = await this.cacheService.getCacheValue(cacheKey)

    if (!getUserById) {
      getUserById = await this.userRepository.findUserById(id)

      if (!getUserById) {
      throw CustomError.NotFoundError('User not found or registered')
      }

      await this.cacheService.cacheValue(cacheKey, getUserById)
    }

    return getUserById
  }
}
