import { Router } from 'express'
import UserController from '../src/controllers/userController'
import EventController from '../src/controllers/eventController'

const routes = Router()

routes.post('/createUser', new UserController().createUser)
routes.get('/user/:cpf', new UserController().getUserByCpf)
routes.delete('/user/:id', new UserController().deleteUserById)

routes.post('/createEvent', new EventController().createEvent)

export default routes
