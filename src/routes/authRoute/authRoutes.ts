import { Router } from 'express'
import AuthController from '../../controllers/authController'
import verifyToken from '../../middlewares/authorization'
import { UserRepository } from '../../application/repositories/userRepository'
import { LoginUseCase } from '../../domain/useCases/auth/login.useCase'

const authRoutes = Router()

const userRepository = new UserRepository()

const loginUseCase = new LoginUseCase(userRepository)

const authController = new AuthController(loginUseCase)

authRoutes.post('/auth/login', authController.login)
authRoutes.post('/auth/verifyToken', verifyToken, authController.authenticated)

export default authRoutes
