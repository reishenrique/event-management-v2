/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserEntity } from '../../domain/entities/UserEntity'
import { CustomError } from '../../domain/errors/customError'
import { IUserRepository } from '../../domain/interfaces/IUserRepository'
import { UserModel } from '../../infraestructure/models/userModel'
import { isDuplicateKeyError } from './mongoErrors'

export class UserRepository implements IUserRepository {
  async createUser(newUser: UserEntity): Promise<UserEntity> {
    try {
      const user = await UserModel.create(newUser)
      return user
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw CustomError.ConflictError(
          'CPF or e-mail already registered in the system',
        )
      }

      throw error
    }
  }

  async findUserByCpf(cpf: string) {
    const userExistsByCPF = await UserModel.findOne({ cpf })
    return userExistsByCPF
  }

  async findUserByEmail(emailAddress: string) {
    const userExistsByEmail = await UserModel.findOne({ emailAddress })
    return userExistsByEmail
  }

  async findUserByEmailForAuth(emailAddress: string) {
    const userExistsByEmail = await UserModel.findOne({ emailAddress }).select(
      '+password',
    )
    return userExistsByEmail
  }

  async findUserById(id: string) {
    const userExistsById = await UserModel.findById(id)
    return userExistsById
  }

  async findUserByIdAndUpdate(id: string, newUserData: any) {
    const findUserAndUpdate = await UserModel.findByIdAndUpdate(
      id,
      newUserData,
      {
        new: true,
        runValidators: true,
      },
    )

    return findUserAndUpdate
  }

  async deleteUserById(id: string) {
    const findUserByIdAndDelete = await UserModel.deleteOne({ _id: id })
    return findUserByIdAndDelete
  }
}
