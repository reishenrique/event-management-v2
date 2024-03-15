import { IUserRepository } from '../../domain/interfaces/IUserRepository'

export class UserRepositoryInMemory implements IUserRepository {
  private users: any[] = []
  constructor(users: any) {
    this.users = users ?? []
  }

  async createUser(newUser: any): Promise<void> {
    this.users.push(newUser)
  }

  async findUserByDocumentCpf(cpf: string) {
    const user = this.users.find((user) => user.cpf === cpf)
    return user
  }

  async findUserByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)
    return user
  }
}
