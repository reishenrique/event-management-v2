/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserEntity } from '../../domain/entities/UserEntity'
import { IUserRepository } from '../../domain/interfaces/IUserRepository'
import { UserModel } from '../../models/userModel'

export class UserRepository implements IUserRepository {
  async createUser(newUser: UserEntity): Promise<UserEntity> {
    const user = await UserModel.create(newUser)
    return user
  }

  async findUserByCpf(cpf: string) {
    const userExistsByCPF = await UserModel.findOne({ cpf })
    return userExistsByCPF
  }

  async findUserByEmail(email: string) {
    const userExistsByEmail = await UserModel.findOne({ emailAddress: email })
    return userExistsByEmail
  }

  async findUserById(id: string) {
    const userExistsById = await UserModel.findById(id)
    return userExistsById
  }

  async findUserByIdAndUpdate(id: string, newData: any) {
    const findUserAndUpdate = await UserModel.findByIdAndUpdate(id, newData, {
      new: true,
    })

    return findUserAndUpdate
  }

  async deleteUserById(id: string) {
    const findUserByIdAndDelete = await UserModel.deleteOne({ _id: id })
    return findUserByIdAndDelete
  }
}
