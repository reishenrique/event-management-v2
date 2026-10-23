import UserController from '../../../controllers/userController'
import { Router } from 'express'
import verifyToken from '../../middlewares/authorization'
import { UserRepository } from '../../../application/repositories/userRepository'
import { CreateUserUseCase } from '../../../domain/useCases/users/createUser.useCase'
import { DeleteUserByIdUseCase } from '../../../domain/useCases/users/deleteUserById.useCase'
import { GetUserByCpfUseCase } from '../../../domain/useCases/users/getUserByCpf.useCase'
import { GetUserByIdUseCase } from '../../../domain/useCases/users/getUserById.useCase'
import { UpdateUserByIdUseCase } from '../../../domain/useCases/users/updateUserById.useCase'
import { cacheService } from '../../cache/cacheInstance'

const userRoutes = Router()

const userRepository = new UserRepository()

const createUserUseCase = new CreateUserUseCase(userRepository)
const getUserByCpfUseCase = new GetUserByCpfUseCase(userRepository, cacheService)
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository, cacheService)
const updateUserByIdUseCase = new UpdateUserByIdUseCase(userRepository)
const deleteUserByIdUseCase = new DeleteUserByIdUseCase(userRepository)

const userController = new UserController(
  createUserUseCase,
  getUserByCpfUseCase,
  getUserByIdUseCase,
  updateUserByIdUseCase,
  deleteUserByIdUseCase,
)

userRoutes.post('/user/new', userController.createUser)
userRoutes.get(
  '/user/document/:cpf',
  verifyToken,
  userController.getUserByCpf,
)
userRoutes.get('/user/id/:id', verifyToken, userController.getUserById)
userRoutes.put('/user/:id', verifyToken, userController.updateUserById)
userRoutes.delete('/user/:id', verifyToken, userController.deleteUserById)

export default userRoutes
