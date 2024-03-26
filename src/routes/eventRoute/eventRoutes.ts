import { Router } from 'express'
import EventController from '../../controllers/eventController'
import verifyToken from '../../middlewares/authorization'
import { EventRepository } from '../../application/repositories/eventRepository'
import { CreateEventUseCase } from '../../domain/useCases/events/createEvent.useCase'
import { GetEventByIdUseCase } from '../../domain/useCases/events/getEventById.useCase'
import { GetEventByCnpjUseCase } from '../../domain/useCases/events/getEventByCnpj.useCase'
import { UpdateEventByIdUseCase } from '../../domain/useCases/events/updateEventById.useCase'
import { DeleteEventByIdUseCase } from '../../domain/useCases/events/deleteEventById.useCase'

const eventRoutes = Router()

const eventRepository = new EventRepository()

const createEventUseCase = new CreateEventUseCase(eventRepository)
const getEventByIdUseCase = new GetEventByIdUseCase(eventRepository)
const getEventByCnpjUseCase = new GetEventByCnpjUseCase(eventRepository)
const updateEventByIdUseCase = new UpdateEventByIdUseCase(eventRepository)
const deleteEventByIdUseCase = new DeleteEventByIdUseCase(eventRepository)

const eventController = new EventController(
  createEventUseCase,
  getEventByIdUseCase,
  getEventByCnpjUseCase,
  updateEventByIdUseCase,
  deleteEventByIdUseCase,
)

eventRoutes.post('/event/createEvent', eventController.createEvent)
eventRoutes.get('/event/getbyid/:id', verifyToken, eventController.getEventById)
eventRoutes.get(
  '/event/getbycnpj/:cnpj',
  verifyToken,
  eventController.getEventByCnpj,
)
eventRoutes.put('/event/:id', verifyToken, eventController.updateEventById)
eventRoutes.delete('/event/:id', verifyToken, eventController.deleteEventById)

export default eventRoutes
