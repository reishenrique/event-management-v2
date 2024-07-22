/* eslint-disable @typescript-eslint/no-explicit-any */

import { CustomError } from '../../../domain/errors/customError'
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

describe('Create user use case', () => {
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

  it('Should throw exception when cpf already registered in the system', async () => {
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
      CustomError.ConflictError('CPF already registered in the system'),
    )

    expect(mockUserRepository.findUserByCpf).toHaveBeenCalledTimes(1)

    expect(mockUserRepository.findUserByEmail).not.toHaveBeenCalled()
    expect(mockUserRepository.createUser).not.toHaveBeenCalled()
  })

  it('Should throw exception when e-mail already registered in the system', async () => {
    const user = {
      firstName: 'Henrique',
      lastName: 'Test Jest',
      userName: 'jesthenrique',
      cpf: '11111111111',
      emailAddress: 'henrique@jest.com',
      phoneNumber: '11951415851',
      password: '12345678',
      confirmPassword: '12345678',
      gender: 'Male',
    }

    const { sut, mockUserRepository } = makeSut([user])

    const user2 = {
      firstName: 'Henrique',
      lastName: 'Test Jest',
      userName: 'jesthenrique',
      cpf: '22222222222',
      emailAddress: 'henrique@jest.com',
      phoneNumber: '11951415851',
      password: '12345678',
      confirmPassword: '12345678',
      gender: 'Male',
    }

    const promise = sut.execute(user2)

    await expect(promise).rejects.toThrow(
      CustomError.ConflictError('E-mail already registered in the system'),
    )

    expect(mockUserRepository.findUserByCpf).toHaveBeenCalledTimes(1)
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1)

    expect(mockUserRepository.createUser).not.toHaveBeenCalled()
  })

  it('Should throw exception when password do not match', async () => {
    const { sut, mockUserRepository } = makeSut()

    const user = {
      firstName: 'Henrique',
      lastName: 'Test Jest',
      userName: 'jesthenrique',
      cpf: '11111111111',
      emailAddress: 'henrique@jest.com',
      phoneNumber: '11951415851',
      password: '12345678',
      confirmPassword: '123456789',
      gender: 'Male',
    }

    const promise = sut.execute(user)

    await expect(promise).rejects.toThrow(
      CustomError.BadRequestError('The passwords do not match'),
    )

    expect(mockUserRepository.findUserByCpf).toHaveBeenCalledTimes(1)
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1)

    expect(mockUserRepository.createUser).not.toHaveBeenCalled()
  })
})
