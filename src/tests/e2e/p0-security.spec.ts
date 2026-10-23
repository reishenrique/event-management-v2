import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../../infraestructure/http/app'

const SECRET = 'test-secret-with-at-least-32-characters!!'
process.env.SECRET = SECRET

const validToken = jwt.sign({ id: 'test-user' }, SECRET)

describe('P0 security fixes', () => {
  describe('cache clear', () => {
    it('rejects a request without a token', async () => {
      const response = await request(app).post('/api/v2/cache/clear')

      expect(response.status).toBe(401)
    })

    it('rejects a malformed Authorization header', async () => {
      const response = await request(app)
        .post('/api/v2/cache/clear')
        .set('Authorization', 'Token abc')

      expect(response.status).toBe(401)
    })

    it('clears the shared cache with a valid token', async () => {
      const response = await request(app)
        .post('/api/v2/cache/clear')
        .set('Authorization', `Bearer ${validToken}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Cache cleared successfully')
    })
  })

  describe('user routes', () => {
    const userId = '65ff47ddd240477491b399bf'

    it('rejects deletion without a token', async () => {
      const response = await request(app).delete(`/api/v2/user/${userId}`)

      expect(response.status).toBe(401)
    })

    it('rejects update without a token', async () => {
      const response = await request(app)
        .put(`/api/v2/user/${userId}`)
        .send({ firstName: 'Intruder' })

      expect(response.status).toBe(401)
    })

    it('keeps id and document routes distinct and protected', async () => {
      const byId = await request(app).get(`/api/v2/user/id/${userId}`)
      const byCpf = await request(app).get(
        '/api/v2/user/document/444.777.666-40',
      )

      expect(byId.status).toBe(401)
      expect(byCpf.status).toBe(401)
    })
  })
})
