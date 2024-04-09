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

  async findUserByEmail(emailAddress: string) {
    const user = this.users.find((user) => user.emailAddress === emailAddress)
    return user
  }

  async findUserById(id: string) {
    const user = this.users.find((user) => user._id === id)
    return user
  }

  async findUserByIdAndUpdate(id: string, newUserData: object) {
    const userIndex = this.users.findIndex((user) => user._id === id)
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...newUserData }
      return this.users[userIndex]
    }

    return null
  }

  async deleteUserById(id: string) {
    const userIndex = this.users.findIndex((user) => user._id === id)
    if (userIndex !== -1) {
      const deletedUser = this.users.splice(userIndex, 1)[0]
      return deletedUser
    }

    return null
  }
}
