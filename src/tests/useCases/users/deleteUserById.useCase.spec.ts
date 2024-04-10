import { CustomError } from '../../../domain/errors/customError'
import { IUserRepository } from '../../../domain/interfaces/IUserRepository'
import { DeleteUserByIdUseCase } from '../../../domain/useCases/users/deleteUserById.useCase'
import { UserRepositoryInMemory } from '../../mock/userRepositoryInMemory'

const makeSut = (
  users?: any,
): {
  sut: DeleteUserByIdUseCase
  mockUserRepository: IUserRepository
} => {
  const mockUserRepository = new UserRepositoryInMemory(users)
  const sut = new DeleteUserByIdUseCase(mockUserRepository)

  jest.spyOn(mockUserRepository, 'deleteUserById')
  jest.spyOn(mockUserRepository, 'findUserById')

  return { sut, mockUserRepository }
}

describe('Delete user by id use case', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('Should delete the user with provided id', async () => {
    const mockUser = {
      _id: '65ff47ddd240477491b399bf',
      firstName: 'John',
      lastName: 'Doe',
      cpf: '12345678901',
      password: 'genericpassword',
      emailAddress: 'johndoe@example.com',
      userName: 'john.doe',
      phoneNumber: '+1234567890',
      gender: 'Male',
    }

    const { sut, mockUserRepository } = makeSut([mockUser])

    const id = '65ff47ddd240477491b399bf'

    await sut.execute(id)

    expect(mockUserRepository.findUserById).toHaveBeenCalledTimes(1)
    expect(mockUserRepository.deleteUserById).toHaveBeenCalledTimes(1)
  })

  it('Should return ax exception when the user is not fount by ID for deletion', async () => {
    const mockUser = {
      _id: '65ff47ddd240477491b399bf',
      firstName: 'John',
      lastName: 'Doe',
      cpf: '12345678901',
      password: 'genericpassword',
      emailAddress: 'johndoe@example.com',
      userName: 'john.doe',
      phoneNumber: '+1234567890',
      gender: 'Male',
    }

    const { sut, mockUserRepository } = makeSut([mockUser])

    const id = '65ff47ddd240477491b399b'

    await expect(sut.execute(id)).rejects.toThrow(
      CustomError.NotFoundError('User not found or registered'),
    )

    expect(mockUserRepository.findUserById).toHaveBeenCalledTimes(1)

    expect(mockUserRepository.deleteUserById).not.toHaveBeenCalled()
  })
})
