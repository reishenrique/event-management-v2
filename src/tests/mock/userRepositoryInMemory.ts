import { UserEntity } from '../../domain/entities/UserEntity'
import { IUserRepository } from '../../domain/interfaces/IUserRepository'

export class UserRepositoryInMemory implements IUserRepository {
  private users: any[] = []
  constructor(users: any) {
    this.users = users ?? []
  }

  async createUser(newUser: object) {
    this.users.push(newUser)
  }

  async findUserByCpf(cpf: string) {
    const user = this.users.find((user) => user.cpf === cpf)
    return user
  }

  async findUserByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)
    return user
  }

  async findUserById(id: string) {
    const user = this.users.find((user) => user._id === id)
    return user
  }

  async findUserByIdAndUpdate(id: string, newData: Partial<UserEntity | null>) {
    const index = this.users.findIndex((user) => user._id === id)
    if (index === -1) {
      return null
    }

    this.users[index] = { ...this.users[index], ...newData }
    return this.users[index]
  }
}
