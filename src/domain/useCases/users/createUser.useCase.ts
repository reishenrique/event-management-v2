/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatCpf } from '../../../infraestructure/utils/formatCpfCnpj'
import { UserEntity } from '../../entities/UserEntity'
import { CustomError } from '../../errors/customError'
import { IUserRepository } from '../../interfaces/IUserRepository'
import bcrypt from 'bcrypt'

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(user: UserEntity): Promise<UserEntity> {
    const { cpf, emailAddress }: { cpf: string; emailAddress: string } =
      user as any

    const formattedCpf = formatCpf(cpf)

    const userExistsByCPF =
      await this.userRepository.findUserByCpf(formattedCpf)

    if (userExistsByCPF) {
      throw CustomError.ConflictError('CPF already registered in the system')
    }

    const userExistsByEmail =
      await this.userRepository.findUserByEmail(emailAddress)

    if (userExistsByEmail) {
      throw CustomError.ConflictError('E-mail already registered in the system')
    }

    const passwordsDoNotMatch = user.password !== user.confirmPassword

    if (passwordsDoNotMatch) {
      throw CustomError.BadRequestError('The passwords do not match')
    }

    const hashPassword = await bcrypt.hash(user.password as string, 10)

    const userWithoutConfirmation = { ...user }
    delete userWithoutConfirmation.confirmPassword

    const newUser = {
      ...userWithoutConfirmation,
      cpf: formattedCpf,
      password: hashPassword,
    }

    const createdUser = await this.userRepository.createUser(newUser)

    return createdUser
  }
}
