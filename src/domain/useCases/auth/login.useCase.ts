/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt'
import 'dotenv/config'
import { CustomError } from '../../errors/customError'
import { IUserRepository } from '../../interfaces/IUserRepository'
import { generateAcessToken } from '../../../infraestructure/utils/jwtUtils'

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(loginUser: object): Promise<string> {
    const {
      emailAddress,
      password,
    }: { emailAddress: string; password: string } = loginUser as any

    const user = await this.userRepository.findUserByEmail(
      emailAddress as string,
    )

    if (!user) {
      throw CustomError.UnauthorizedError('Unauthorized')
    }

    const isValidPassword = await bcrypt.compareSync(
      password as string,
      user.password,
    )

    if (!isValidPassword) {
      throw CustomError.UnauthorizedError('Invalid password')
    }

    const token = generateAcessToken(user)

    return token
  }
}
