import type { CacheService } from '../../../infraestructure/cache/service/cacheService'
import { CustomError } from '../../errors/customError'
import type { IUserRepository } from '../../interfaces/IUserRepository'

export class GetUserByCpfUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cacheService: CacheService
  ) { }

  async execute(cpf?: string) {
    if (!cpf || typeof cpf !== 'string') {
      throw CustomError.BadRequestError(
        'User ID is required to proceed with the search execution',
      )
    }

    const cacheKey = `user:${cpf}`

    let getUserByCpf = await this.cacheService.getCacheValue(cacheKey)

    if (!getUserByCpf) {
      getUserByCpf = await this.userRepository.findUserByCpf(cpf)

      if (!getUserByCpf) {
        throw CustomError.NotFoundError('User not found or registered')
      }

      await this.cacheService.cacheValue(cacheKey, getUserByCpf)
    }

    return getUserByCpf
  }
}
