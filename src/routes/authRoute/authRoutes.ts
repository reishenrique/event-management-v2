import { Router } from 'express'
import AuthController from '../../controllers/authController'

const authRoutes = Router()

authRoutes.post('/auth/login', new AuthController().login)

export default authRoutes
