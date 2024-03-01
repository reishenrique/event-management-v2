import { Router } from 'express'
import AuthController from '../../controllers/authController'
import verifyToken from '../../middlewares/authorization'

const authRoutes = Router()

authRoutes.post('/auth/login', new AuthController().login)
authRoutes.post(
  '/auth/verifytoken',
  verifyToken,
  new AuthController().authenticated,
)

export default authRoutes
