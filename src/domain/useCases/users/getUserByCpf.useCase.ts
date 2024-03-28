import { CustomError } from '../../errors/customError'
import { IUserRepository } from '../../interfaces/IUserRepository'

export class GetUserByCpfUseCase {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(cpf: string) {
    if (!cpf) {
      throw CustomError.BadRequestError(
        'User ID is required to proceed with the search execution',
      )
    }

    const getUserByCpf = await this.userRepository.findUserByCpf(cpf)

    if (!getUserByCpf) {
      throw CustomError.NotFoundError('User not found or registered')
    }

    return getUserByCpf
  }
}
