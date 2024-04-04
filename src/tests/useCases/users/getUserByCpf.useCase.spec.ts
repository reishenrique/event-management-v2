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
      password: '$2b$10$AkWNf0h3r2T5Cbpz7jdtoeXFtp6J0k5g1hS8QElewxya.6y0JNGJy',
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
})
