import { Router } from 'express'
import UserController from '../src/controllers/userController'
import EventController from '../src/controllers/eventController'

const routes = Router()

routes.post('/user/createUser', new UserController().createUser)
routes.get('/user/bycpf/:cpf', new UserController().getUserByCpf)
routes.get('/user/byid/:id', new UserController().getUserById)
routes.delete('/user/:id', new UserController().deleteUserById)
routes.put('/user/:id', new UserController().updateUserById)

routes.post('/event/createEvent', new EventController().createEvent)

export default routes
