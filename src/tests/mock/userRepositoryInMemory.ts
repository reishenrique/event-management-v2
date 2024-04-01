import { UserEntity } from '../../domain/entities/UserEntity'
import { CustomError } from '../../domain/errors/customError'
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

    if (user) {
      throw CustomError.ConflictError('E-mail already registered in the system')
    }
  }

  async findUserById(id: string) {
    const user = this.users.find((user) => user._id === id)
    return user
  }

  async findUserByIdAndUpdate(
    id: string,
    newUserData: Partial<UserEntity | null>,
  ) {
    const index = this.users.findIndex((user) => user._id === id)
    if (index === -1) {
      return null
    }

    this.users[index] = { ...this.users[index], ...newUserData }
    return this.users[index]
  }

  async deleteUserById(id: string) {
    const index = this.users.findIndex((user) => user.id === id)
    if (index !== -1) {
      this.users.splice(index, 1)
    }
  }
}
