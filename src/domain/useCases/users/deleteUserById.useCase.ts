import { CustomError } from '../../errors/customError'
import { IUserRepository } from './../../interfaces/IUserRepository'

export class DeleteUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(id: string) {
    const getUserById = await this.userRepository.findUserById(id)

    if (!getUserById) {
      throw CustomError.NotFoundError('User not found or registered')
    }

    await this.userRepository.deleteUserById(id)
  }
}
