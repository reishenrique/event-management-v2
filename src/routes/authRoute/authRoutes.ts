import { Router } from 'express'
import AuthController from '../../controllers/authController'
import Authorization from '../../middlewares/authorization'

const authRoutes = Router()

authRoutes.post('/auth/login', new AuthController().login)
authRoutes.post(
  '/auth/verifytoken',
  new Authorization().verifyToken,
  new AuthController().authenticated,
)

export default authRoutes
