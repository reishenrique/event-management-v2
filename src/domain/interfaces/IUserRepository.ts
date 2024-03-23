import { UserEntity } from '../entities/UserEntity'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUserRepository {
  createUser(newUser: UserEntity): any
  findUserByCpf(cpf: string): any
  findUserByEmail(email: string): any
  findUserById(id: string): any
  findUserByIdAndUpdate(id: string, newData: any): any
  deleteUserById(id: string): any
}
