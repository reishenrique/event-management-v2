import { IUserRepository } from '../../interfaces/IUserRepository'
import bcrypt from 'bcrypt'

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(user: any) {
    const { cpf, emailAddress }: { cpf: string; emailAddress: string } =
      user as any

    const userExistsByCPF = await this.userRepository.findUserByDocumentCpf(cpf)

    if (userExistsByCPF) {
      throw new Error('CPF already registered in the system')
    }

    const userExistsByEmail =
      await this.userRepository.findUserByEmail(emailAddress)

    if (userExistsByEmail) {
      throw new Error('E-mail already registered in the system')
    }

    const saltRounds = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password as string, saltRounds)

    const matchPassword = user.password !== user.confirmPassword

    if (matchPassword) {
      throw new Error('The passwords do not match')
    }

    const newUser = {
      ...user,
      password: hashPassword,
    }

    await this.userRepository.createUser(newUser)

    return newUser
  }
}
