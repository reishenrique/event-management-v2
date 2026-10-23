import { UserModel } from '../../../infraestructure/models/userModel'
import { UserRepository } from '../../../application/repositories/userRepository'
import { CustomError } from '../../../domain/errors/customError'

describe('User repository', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('maps a duplicate key error to 409 Conflict', async () => {
    const duplicateKeyError = Object.assign(new Error('E11000 duplicate key'), {
      code: 11000,
    })

    jest
      .spyOn(UserModel, 'create')
      .mockRejectedValue(duplicateKeyError as never)

    const repository = new UserRepository()
    const promise = repository.createUser({})

    await expect(promise).rejects.toBeInstanceOf(CustomError)
    await expect(promise).rejects.toMatchObject({ statusCode: 409 })
  })
})
