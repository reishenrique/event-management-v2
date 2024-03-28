import { CustomError } from '../../errors/customError'
import { IUserRepository } from '../../interfaces/IUserRepository'

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(id: string) {
    if (!id) {
      throw CustomError.BadRequestError(
        'User ID is required to proceed with the search execution',
      )
    }

    const getUserById = await this.userRepository.findUserById(id)

    if (!getUserById) {
      throw CustomError.NotFoundError('User not found or registered')
    }

    return getUserById
  }
}
