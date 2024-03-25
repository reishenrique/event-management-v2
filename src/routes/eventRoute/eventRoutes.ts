import { Router } from 'express'
import EventController from '../../controllers/eventController'
import verifyToken from '../../middlewares/authorization'
import { EventRepository } from '../../application/repositories/eventRepository'
import { CreateEventUseCase } from '../../domain/useCases/events/createEvent.useCase'

const eventRoutes = Router()

const eventRepository = new EventRepository()

const createEventUseCase = new CreateEventUseCase(eventRepository)

const eventController = new EventController(createEventUseCase)

eventRoutes.post('/event/createEvent', verifyToken, eventController.createEvent)
eventRoutes.get('/event/getbyid/:id', verifyToken, eventController.getEventById)
eventRoutes.get(
  '/event/getbycnpj/:cnpj',
  verifyToken,
  eventController.getEventByCnpj,
)
eventRoutes.delete('/event/:id', verifyToken, eventController.deleteEventById)
eventRoutes.put('/event/:id', verifyToken, eventController.updateEventById)

export default eventRoutes
