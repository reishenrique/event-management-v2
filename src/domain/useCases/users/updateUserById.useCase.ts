import { CustomError } from '../../errors/customError'
import { IUserRepository } from '../../interfaces/IUserRepository'

export class UpdateUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(id: string, newUserData: string) {
    if (!id) {
      throw CustomError.BadRequestError(
        'User ID is required to proceed with update execution',
      )
    }

    const findUserAndUpdate = await this.userRepository.findUserByIdAndUpdate(
      id,
      newUserData,
    )

    if (!findUserAndUpdate) {
      throw CustomError.NotFoundError('User not found for update')
    }

    return findUserAndUpdate
  }
}
