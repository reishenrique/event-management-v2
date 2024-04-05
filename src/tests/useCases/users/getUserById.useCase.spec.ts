import { CustomError } from '../../../domain/errors/customError'
import { IUserRepository } from '../../../domain/interfaces/IUserRepository'
import { GetUserByIdUseCase } from '../../../domain/useCases/users/getUserById.useCase'
import { UserRepositoryInMemory } from '../../mock/userRepositoryInMemory'

const makeSut = (
  users?: any,
): { sut: GetUserByIdUseCase; mockUserRepository: IUserRepository } => {
  const mockUserRepository = new UserRepositoryInMemory(users)
  const sut = new GetUserByIdUseCase(mockUserRepository)

  jest.spyOn(mockUserRepository, 'findUserById')

  return { sut, mockUserRepository }
}

describe('Get user by id', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('Should search for a user by their id and return successfully', async () => {
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

    const user = await sut.execute(id)

    expect(user).toEqual(mockUser)

    expect(mockUserRepository.findUserById).toHaveBeenCalledTimes(1)
  })

  it('Should throw an exception when the user id is not provided', async () => {
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

    await expect(sut.execute(undefined)).rejects.toThrow(
      CustomError.BadRequestError(
        'User ID is required to proceed with the search execution',
      ),
    )

    expect(mockUserRepository.findUserById).not.toHaveBeenCalled()
  })

  it('Should throw an exception when the user is not found by the provided ID', async () => {
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

    const user = sut.execute(id)

    await expect(user).rejects.toThrow(
      CustomError.NotFoundError('User not found or registered'),
    )

    expect(mockUserRepository.findUserById).toHaveBeenCalledTimes(1)
  })
})
