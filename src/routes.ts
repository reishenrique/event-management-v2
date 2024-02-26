import { Router } from 'express'
import UserController from '../src/controllers/userController'
import EventController from '../src/controllers/eventController'

const routes = Router()

routes.post('/user/createUser', new UserController().createUser)
routes.get('/user/getbycpf/:cpf', new UserController().getUserByCpf)
routes.get('/user/getbyid/:id', new UserController().getUserById)
routes.delete('/user/:id', new UserController().deleteUserById)
routes.put('/user/:id', new UserController().updateUserById)

routes.post('/event/createEvent', new EventController().createEvent)
routes.get('/event/getbyid/:id', new EventController().getEventById)
routes.get('/event/getbycnpj/:cnpj', new EventController().getEventByCnpj)

export default routes
