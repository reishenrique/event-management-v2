import { CustomError } from '../../../domain/errors/customError'
import { IUserRepository } from '../../../domain/interfaces/IUserRepository'
import { GetUserByCpfUseCase } from '../../../domain/useCases/users/getUserByCpf.useCase'
import { UserRepositoryInMemory } from '../../mock/userRepositoryInMemory'

const makeSut = (
  users?: any,
): { sut: GetUserByCpfUseCase; mockUserRepository: IUserRepository } => {
  const mockUserRepository = new UserRepositoryInMemory(users)
  const sut = new GetUserByCpfUseCase(mockUserRepository)

  jest.spyOn(mockUserRepository, 'findUserByCpf')

  return { sut, mockUserRepository }
}

describe('Get user use case', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('Should search for a user by their cpf and return successfully', async () => {
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

    const cpf = '12345678901'

    const user = await sut.execute(cpf)

    expect(user).toEqual(mockUser)

    expect(mockUserRepository.findUserByCpf).toHaveBeenCalledTimes(1)
  })

  it('Should throw an exception when the user cpf is not provided', async () => {
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

    expect(mockUserRepository.findUserByCpf).not.toHaveBeenCalled()
  })
})
