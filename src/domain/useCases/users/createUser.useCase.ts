/* eslint-disable @typescript-eslint/no-explicit-any */
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

    const userExistsByCPF = await this.userRepository.findUserByCpf(cpf)

    if (userExistsByCPF) {
      throw CustomError.ConflictError('CPF already registered in the system')
    }

    const userExistsByEmail =
      await this.userRepository.findUserByEmail(emailAddress)

    if (userExistsByEmail) {
      throw CustomError.ConflictError('E-mail already registered in the system')
    }

    const saltRounds = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password as string, saltRounds)

    const matchPassword = user.password !== user.confirmPassword

    if (matchPassword) {
      throw CustomError.BadRequestError('The passwords do not match')
    }

    const newUser = {
      ...user,
      password: hashPassword,
    }

    await this.userRepository.createUser(newUser)

    return newUser
  }
}
