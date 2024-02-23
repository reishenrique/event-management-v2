// import request from 'supertest'
// import { app } from '../../app'

// describe('UserController', () => {
//   test('Should create a new user', async () => {
//     const userData = {
//       firstName: 'Henrique',
//       lastName: 'Reis',
//       userName: 'userhenrique',
//       cpf: '11122233344',
//       emailAddress: 'testehenrique@gmail.com',
//       phoneNumber: '1199992222',
//       password: 'testesenha',
//       confirmPassword: 'testesenha',
//       gender: 'Masculine',
//     }

//     const response = await request(app)
//       .post('/user/createUser')
//       .send({ userData })
//       .expect(201)

//     expect(response.body).toHaveProperty('firstName')
//   })
// })
