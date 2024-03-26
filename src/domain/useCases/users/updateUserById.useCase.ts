import { IUserRepository } from '../../interfaces/IUserRepository'

export class UpdateUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(id: string, newUserData: string) {
    if (!id) {
      throw new Error('User ID is required to proceed with update execution')
    }

    const findUserAndUpdate = await this.userRepository.findUserByIdAndUpdate(
      id,
      newUserData,
    )

    if (!findUserAndUpdate) {
      throw new Error('User not found for update')
    }

    return findUserAndUpdate
  }
}
