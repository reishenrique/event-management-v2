import { IUserRepository } from '../../interfaces/IUserRepository'

export class GetUserByCpfUseCase {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(cpf: string) {
    if (!cpf) {
      throw new Error(
        'User ID is required to proceed with the search execution',
      )
    }

    const getUserByCpf = await this.userRepository.findUserByCpf(cpf)

    if (!getUserByCpf) {
      throw new Error('User not found or registered')
    }

    return getUserByCpf
  }
}
