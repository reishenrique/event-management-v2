/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserEntity } from '../entities/UserEntity'

export interface IUserRepository {
  createUser(newUser: UserEntity): any
  findUserByCpf(cpf: string): any
  findUserByEmail(email: string): any
  findUserById(id: string): any
  findUserByIdAndUpdate(id: string, newUserData: any): any
  deleteUserById(id: string): any
}
