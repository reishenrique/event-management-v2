import { IUserRepository } from '../../interfaces/IUserRepository'

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(id: string) {
    if (!id) {
      throw new Error(
        'User ID is required to proceed with the search execution',
      )
    }

    const getUserById = await this.userRepository.findUserById(id)

    if (!getUserById) {
      throw new Error('User not found or registered')
    }

    return getUserById
  }
}
