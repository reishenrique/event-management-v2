import { Request, Response } from 'express'
import { z } from 'zod'
import { EventModel } from '../models/eventModel'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

interface IEventController {
  createEvent(req: Request, res: Response): Promise<unknown>
}
export class EventController implements IEventController {
  public async createEvent(req: Request, res: Response): Promise<unknown> {
    const eventSchema = z.object({
      eventName: z
        .string({ required_error: 'Event name is required' })
        .optional(),
      eventDescription: z
        .string({ required_error: 'Description is required' })
        .optional(),
      cnpj: z
        .string({ required_error: 'CNPJ is required' })
        .length(14, { message: 'The CNPJ need contain 14 digits' })
        .optional(),
      date: z
        .date({ required_error: 'Event date and time are required' })
        .optional(),
      eventLocation: z
        .string({ required_error: 'Event location is required' })
        .optional(),
      eventType: z
        .string({ required_error: 'Event type is required' })
        .optional(),
      eventTicketPrice: z
        .string({
          required_error: 'The event ticket price is required',
        })
        .optional(),
      venueCapacity: z
        .number({
          required_error: 'The venue capacity for the event is required',
        })
        .optional(),
      contactInformation: z.string().optional(),
    })

    try {
      const event = eventSchema.parse(req.body)
      const { eventName, cnpj } = event

      const eventExistsByEventName = await EventModel.findOne({ eventName })

      if (eventExistsByEventName) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send('Event already registered in the system')
      }

      const eventExistsByCNPJ = await EventModel.findOne({ cnpj })

      if (eventExistsByCNPJ) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send('CNPJ already registered in the system')
      }

      const newEvent = event

      await EventModel.create(newEvent)
      return res
        .status(StatusCodes.CREATED)
        .send('Event successfully registered')
    } catch (error) {
      console.log('Error when trying to create an event.', error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }
  }
}

export default EventController
