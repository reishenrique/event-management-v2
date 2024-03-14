import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

const stringConnection = process.env.DATABASE_CONNECTION as string

describe('UserController', () => {
  beforeAll(async () => {
    await mongoose.connect(stringConnection)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('Test /createUser endpoint', async () => {
    const response = await request(app).post('/api/v2/user/createUser').send({
      firstName: 'Henrique',
      lastName: 'Test Jest',
      userName: 'jesthenrique',
      cpf: '44477766640',
      emailAddress: 'henrique@jest.com',
      phoneNumber: '11951415851',
      password: 'hprhpr09',
      confirmPassword: 'hprhpr09',
      gender: 'Male',
    })

    expect(response.statusCode).toEqual(300)
    expect(response).toBe(true)
  })
})
