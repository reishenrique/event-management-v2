/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import { CustomError } from '../../errors/customError'
import { IUserRepository } from '../../interfaces/IUserRepository'
import { AuthEntity } from '../../entities/AuthEntity'

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(loginUser: AuthEntity): Promise<any> {
    const { emailAddress, password } = loginUser

    const secret = process.env.SECRET

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

    const token = jwt.sign(
      { id: user._id, email: user.emailAddress },
      secret || '',
      {
        expiresIn: '8h',
      },
    )

    return token
  }
}
