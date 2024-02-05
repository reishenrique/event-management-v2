import { Router } from 'express'
import UserController from '../src/controllers/userController'
import EventController from '../src/controllers/eventController'

const routes = Router()

routes.post('/createUser', new UserController().createUser)

routes.post('/createEvent', new EventController().createEvent)

export default routes
