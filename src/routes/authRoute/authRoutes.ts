import { Router } from 'express'
import AuthController from '../../controllers/authController'
import verifyToken from '../../middlewares/authorization'

const authRoutes = Router()

const authController = new AuthController()

authRoutes.post('/auth/login', authController.login)
authRoutes.post('/auth/verifyToken', verifyToken, authController.authenticated)

export default authRoutes
