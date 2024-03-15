/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateUserUseCase } from './createUser.useCase'
import { UserRepositoryInMemory } from '../../../tests/mock/userRepositoryInMemory'
import { IUserRepository } from '../../interfaces/IUserRepository'

const makeSut = (
  users?: any,
): {
  sut: CreateUserUseCase
  mockUserRepository: IUserRepository
} => {
  const mockUserRepository = new UserRepositoryInMemory(users)
  const sut = new CreateUserUseCase(mockUserRepository)

  jest.spyOn(mockUserRepository, 'findUserByDocumentCpf')
  jest.spyOn(mockUserRepository, 'findUserByEmail')
  jest.spyOn(mockUserRepository, 'createUser')

  return { sut, mockUserRepository }
}

describe('UserController', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('Should create a new user with success', async () => {
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

    expect(mockUserRepository.findUserByDocumentCpf).toHaveBeenCalledTimes(1)
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1)
  })

  it('Should create a new user with error', async () => {
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

    expect(mockUserRepository.findUserByDocumentCpf).toHaveBeenCalledTimes(1)

    expect(mockUserRepository.findUserByEmail).not.toHaveBeenCalled()
    expect(mockUserRepository.createUser).not.toHaveBeenCalled()
  })
})
