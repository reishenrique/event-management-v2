/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserRepository } from '../../domain/interfaces/IUserRepository'
import { UserModel } from '../../models/userModel'

export class UserRepository implements IUserRepository {
  async createUser(newUser: any): Promise<object> {
    const user = await UserModel.create(newUser)
    return user
  }

  async findDocumentUserByCpf(cpf: string) {
    const userExistsByCPF = await UserModel.findOne({ cpf })
    return userExistsByCPF
  }

  async findUserByEmail(email: string) {
    const userExistsByEmail = await UserModel.findOne({ emailAddress: email })
    return userExistsByEmail
  }
}
