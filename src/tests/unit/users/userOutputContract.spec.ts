import { toPublicUser } from '../../../application/mappers/userMapper'
import { updateUserSchemaValidator } from '../../../application/validators/userSchemaValidator'

describe('User output contract', () => {
  it('never exposes password or confirmPassword', () => {
    const storedUser = {
      _id: '65ff47ddd240477491b399bf',
      firstName: 'John',
      lastName: 'Doe',
      userName: 'john.doe',
      cpf: '44477766640',
      emailAddress: 'john@example.com',
      phoneNumber: '11999999999',
      gender: 'Male',
      password: '$2b$10$hash',
      confirmPassword: 'plain-text',
    }

    const publicUser = toPublicUser(storedUser)

    expect(publicUser).toEqual({
      id: '65ff47ddd240477491b399bf',
      firstName: 'John',
      lastName: 'Doe',
      userName: 'john.doe',
      cpf: '44477766640',
      emailAddress: 'john@example.com',
      phoneNumber: '11999999999',
      gender: 'Male',
    })
    expect(publicUser).not.toHaveProperty('password')
    expect(publicUser).not.toHaveProperty('confirmPassword')
  })
})

describe('Update user allowlist', () => {
  it('accepts editable fields', () => {
    const data = updateUserSchemaValidator.parse({
      firstName: 'Ana',
      phoneNumber: '11988887777',
    })

    expect(data).toEqual({ firstName: 'Ana', phoneNumber: '11988887777' })
  })

  it.each(['password', 'confirmPassword', 'cpf', 'emailAddress'])(
    'rejects %s on update',
    (field) => {
      expect(() =>
        updateUserSchemaValidator.parse({ firstName: 'Ana', [field]: 'x' }),
      ).toThrow()
    },
  )
})
