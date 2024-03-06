import { Router } from 'express'
import EventController from '../../controllers/eventController'
import verifyToken from '../../middlewares/authorization'

const eventRoutes = Router()

eventRoutes.post(
  '/event/createEvent',
  verifyToken,
  new EventController().createEvent,
)

eventRoutes.get(
  '/event/getbyid/:id',
  verifyToken,
  new EventController().getEventById,
)

eventRoutes.get(
  '/event/getbycnpj/:cnpj',
  verifyToken,
  new EventController().getEventByCnpj,
)

eventRoutes.delete(
  '/event/:id',
  verifyToken,
  new EventController().deleteEventById,
)

eventRoutes.put(
  '/event/:id',
  verifyToken,
  new EventController().updateEventById,
)

export default eventRoutes
