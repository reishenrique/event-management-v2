import { Router } from 'express'
import UserController from '../../controllers/userController'

const userRoutes = Router()

userRoutes.post('/user/createUser', new UserController().createUser)
userRoutes.get('/user/getbycpf/:cpf', new UserController().getUserByCpf)
userRoutes.get('/user/getbyid/:id', new UserController().getUserById)
userRoutes.delete('/user/:id', new UserController().deleteUserById)
userRoutes.put('/user/:id', new UserController().updateUserById)

export default userRoutes
