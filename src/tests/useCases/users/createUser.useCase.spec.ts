/* eslint-disable @typescript-eslint/no-explicit-any */

import { IUserRepository } from '../../../domain/interfaces/IUserRepository'
import { CreateUserUseCase } from '../../../domain/useCases/users/createUser.useCase'
import { UserRepositoryInMemory } from '../../mock/userRepositoryInMemory'

const makeSut = (
  users?: any,
): {
  sut: CreateUserUseCase
  mockUserRepository: IUserRepository
} => {
  const mockUserRepository = new UserRepositoryInMemory(users)
  const sut = new CreateUserUseCase(mockUserRepository)

  jest.spyOn(mockUserRepository, 'findUserByCpf')
  jest.spyOn(mockUserRepository, 'findUserByEmail')
  jest.spyOn(mockUserRepository, 'createUser')

  return { sut, mockUserRepository }
}

describe('UserController', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('Should return a new user successfully registered', async () => {
    const { sut, mockUserRepository } = makeSut()
    const user = {
      firstName: 'Henrique',
      lastName: 'Test Jest',
      userName: 'jesthenrique',
      cpf: '44477766640',
      emailAddress: 'henrique@jest.com',
      phoneNumber: '11951415851',
      password: '12345678',
      confirmPassword: '12345678',
      gender: 'Male',
    }

    const newUser = await sut.execute(user)

    expect(newUser.firstName).toBe(user.firstName)

    expect(mockUserRepository.findUserByCpf).toHaveBeenCalledTimes(1)
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1)
  })

  it('Should return the exception for cpf already registered in the system', async () => {
    const user = {
      firstName: 'Henrique',
      lastName: 'Test Jest',
      userName: 'jesthenrique',
      cpf: '44477766640',
      emailAddress: 'henrique@jest.com',
      phoneNumber: '11951415851',
      password: '12345678',
      confirmPassword: '12345678',
      gender: 'Male',
    }

    const { sut, mockUserRepository } = makeSut([user])

    expect(sut.execute(user)).rejects.toThrow(
      new Error('CPF already registered in the system'),
    )

    expect(mockUserRepository.findUserByCpf).toHaveBeenCalledTimes(1)

    expect(mockUserRepository.findUserByEmail).not.toHaveBeenCalled()
    expect(mockUserRepository.createUser).not.toHaveBeenCalled()
  })
})
