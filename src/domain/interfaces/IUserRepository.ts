import { UserEntity } from '../entities/UserEntity'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUserRepository {
  createUser(newUser: UserEntity): any
  findDocumentUserByCpf(cpf: string): any
  findUserByEmail(email: string): any
}
