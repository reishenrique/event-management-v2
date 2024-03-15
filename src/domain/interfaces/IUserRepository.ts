/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUserRepository {
  createUser(newUser: any): void
  findDocumentUserByCpf(cpf: string): any
  findUserByEmail(email: string): any
}
