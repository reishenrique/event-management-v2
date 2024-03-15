import { UserRepository } from './../../application/repositories/userRepository'
import { Router } from 'express'
import UserController from '../../controllers/userController'
import { CreateUserUseCase } from '../../domain/useCases/users/createUser.useCase'

const userRoutes = Router()

const userRepository = new UserRepository()
const createUserUseCase = new CreateUserUseCase(userRepository)
const userController = new UserController(createUserUseCase)

userRoutes.post('/user/createUser', userController.createUser)
userRoutes.get('/user/getbycpf/:cpf', userController.getUserByCpf)
userRoutes.get('/user/getbyid/:id', userController.getUserById)
userRoutes.delete('/user/:id', userController.deleteUserById)
userRoutes.put('/user/:id', userController.updateUserById)

export default userRoutes
