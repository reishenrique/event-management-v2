import { CustomError } from '../../../domain/errors/customError'
import { IUserRepository } from '../../../domain/interfaces/IUserRepository'
import { UpdateUserByIdUseCase } from '../../../domain/useCases/users/updateUserById.useCase'
import { UserRepositoryInMemory } from '../../mock/userRepositoryInMemory'

const makeSut = (
  users?: any,
): { sut: UpdateUserByIdUseCase; mockUserRepository: IUserRepository } => {
  const mockUserRepository = new UserRepositoryInMemory(users)
  const sut = new UpdateUserByIdUseCase(mockUserRepository)

  jest.spyOn(mockUserRepository, 'findUserByIdAndUpdate')

  return { sut, mockUserRepository }
}

describe('Update user by id', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('Should search for a user by ID and update the data', async () => {
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

    const newUserData = {
      firstName: 'Ronaldinho',
      lastName: 'Gaúcho',
    }

    const user = await sut.execute(id, newUserData)
    console.log(user)

    expect(user.firstName).toBe('Ronaldinho')
    expect(user.lastName).toBe('Gaúcho')

    expect(mockUserRepository.findUserByIdAndUpdate).toHaveBeenCalledTimes(1)
  })

  it('should return an exception when the user ID is not provided for search and update', async () => {
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

    const newUserData = {
      firstName: 'Ronaldinho',
      lastName: 'Gaúcho',
    }

    await expect(sut.execute(undefined, newUserData)).rejects.toThrow(
      CustomError.BadRequestError(
        'User ID is required to proceed with update execution',
      ),
    )

    expect(mockUserRepository.findUserByIdAndUpdate).not.toHaveBeenCalled()
  })
})
