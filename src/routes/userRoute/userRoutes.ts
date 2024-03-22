import { UserRepository } from './../../application/repositories/userRepository'
import { Router } from 'express'
import UserController from '../../controllers/userController'
import { CreateUserUseCase } from '../../domain/useCases/users/createUser.useCase'
import { GetUserByCpfUseCase } from '../../domain/useCases/users/getUserByCpf.useCase'
import { GetUserByIdUseCase } from '../../domain/useCases/users/getUserById.useCase'
import UpdateUserByIdUseCase from '../../domain/useCases/users/updateUserById.useCase'

const userRoutes = Router()

const userRepository = new UserRepository()

const createUserUseCase = new CreateUserUseCase(userRepository)
const getUserByCpfUseCase = new GetUserByCpfUseCase(userRepository)
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
const updateUserByIdUseCase = new UpdateUserByIdUseCase(userRepository)

const userController = new UserController(
  createUserUseCase,
  getUserByCpfUseCase,
  getUserByIdUseCase,
  updateUserByIdUseCase,
)

userRoutes.post('/user/createUser', userController.createUser)
userRoutes.get('/user/getbycpf/:cpf', userController.getUserByCpf)
userRoutes.get('/user/getbyid/:id', userController.getUserById)
userRoutes.put('/user/:id', userController.updateUserById)
userRoutes.delete('/user/:id', userController.deleteUserById)

export default userRoutes
