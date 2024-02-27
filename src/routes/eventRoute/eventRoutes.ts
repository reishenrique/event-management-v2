import { Router } from 'express'
import EventController from '../../controllers/eventController'

const eventRoutes = Router()

eventRoutes.post('/event/createEvent', new EventController().createEvent)
eventRoutes.get('/event/getbyid/:id', new EventController().getEventById)
eventRoutes.get('/event/getbycnpj/:cnpj', new EventController().getEventByCnpj)
eventRoutes.delete('/event/:id', new EventController().deleteEventById)
eventRoutes.put('/event/:id', new EventController().updateEventById)

export default eventRoutes
