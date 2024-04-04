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
})
