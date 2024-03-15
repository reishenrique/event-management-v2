/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUserRepository {
  createUser(newUser: any): void
  findUserByDocumentCpf(cpf: string): any
  findUserByEmail(email: string): any
}
