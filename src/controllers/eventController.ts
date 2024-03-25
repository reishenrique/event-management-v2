import { Request, Response } from 'express'
import { z } from 'zod'
import { EventModel } from '../models/eventModel'
import { StatusCodes } from 'http-status-codes'
import { eventTypeEnum } from '../enum/eventTypeEnum'
import { paymentMethodEnum } from '../enum/paymentMethodEnum'
import { CreateEventUseCase } from '../domain/useCases/events/createEvent.useCase'

interface IEventController {
  createEvent(req: Request, res: Response): Promise<object>
  getEventByCnpj(req: Request, res: Response): Promise<object>
  getEventById(req: Request, res: Response): Promise<object>
  updateEventById(req: Request, res: Response): Promise<object>
  deleteEventById(req: Request, res: Response): Promise<object>
}
export class EventController implements IEventController {
  constructor(private readonly createEventUseCase: CreateEventUseCase) {
    this.createEvent = this.createEvent.bind(this)
  }

  async createEvent(req: Request, res: Response): Promise<object> {
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
      location: z.string({ required_error: 'Location is required' }).optional(),
      eventType: z
        .enum(
          [
            eventTypeEnum.ACADEMIC_EDUCATIONAL_EVENT,
            eventTypeEnum.CORPORATE_EVENT,
            eventTypeEnum.CULTURAL_ENTERTAINMENT_EVENT,
            eventTypeEnum.RELIGIOUS_EVENT,
            eventTypeEnum.SOCIAL_EVENT,
            eventTypeEnum.SPORTING_EVENT,
          ],
          {
            required_error:
              'A type of event needs to be one of those available',
          },
        )
        .optional(),
      eventTicketPrice: z
        .number({
          required_error: 'The event ticket price is required',
        })
        .optional(),
      venueCapacity: z
        .number({
          required_error: 'The venue capacity for the event is required',
        })
        .optional(),
      contactInformation: z
        .string({ required_error: 'Contact Information is required ' })
        .optional(),
      paymentMethodOption: z
        .enum(
          [
            paymentMethodEnum.CREDIT,
            paymentMethodEnum.DEBIT,
            paymentMethodEnum.BANK_SLIP,
          ],
          {
            required_error:
              'The payment method needs to be one of those available',
          },
        )
        .optional(),
    })

    try {
      const event = eventSchema.parse(req.body)
      const newEvent = await this.createEventUseCase.execute(event)

      return res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: 'Event successfully registered',
        event: newEvent,
      })
    } catch (error) {
      console.log('Error while executing the event creation endpoint', error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error while executing the event creation endpoint',
      })
    }
  }

  async getEventById(req: Request, res: Response): Promise<object> {
    const { id } = req.params

    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Event ID is required to proceed with the search execution',
      })
    }

    try {
      const getEventById = await EventModel.findById(id)

      if (!getEventById) {
        return res.status(StatusCodes.NOT_FOUND).json({
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Event ID not found',
        })
      }

      return res
        .status(StatusCodes.OK)
        .json({ statusCode: StatusCodes.OK, user: getEventById })
    } catch (error) {
      console.log(
        'Error while executing the endpoint to search for a user by ID',
        error,
      )

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message:
          'Error while executing the endpoint to search for a user by ID',
      })
    }
  }

  async getEventByCnpj(req: Request, res: Response): Promise<object> {
    const { cnpj } = req.params

    if (!cnpj) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Event CNPJ is required to proceed with the search execution',
      })
    }

    try {
      const getEventByCnpj = await EventModel.findOne({ cnpj })

      if (!getEventByCnpj) {
        return res.status(StatusCodes.NOT_FOUND).json({
          statusCode: StatusCodes.NOT_FOUND,
          message: 'User not found or registered',
        })
      }

      return res
        .status(StatusCodes.OK)
        .json({ statusCode: StatusCodes.OK, user: getEventByCnpj })
    } catch (error) {
      console.log(
        'Error while executing the endpoint to search for a user by CNPJ',
        error,
      )

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message:
          'Error while executing the endpoint to search for a user by CNPJ',
      })
    }
  }

  async updateEventById(req: Request, res: Response): Promise<object> {
    try {
      const { id } = req.params
      const dataEventUpdate = req.body

      const getEventToUpate = await EventModel.findByIdAndUpdate(
        id,
        dataEventUpdate,
        {
          new: true,
        },
      )

      if (!getEventToUpate) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send('Event not found to perform data update')
      }

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Event data successfully updated',
        updatedEvent: getEventToUpate,
      })
    } catch (error) {
      console.log(
        'Error while executing the endpoint for updating the event by ID',
      )

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message:
          'Error while executing the endpoint for updating the event by ID',
      })
    }
  }

  async deleteEventById(req: Request, res: Response): Promise<object> {
    try {
      const { id } = req.params

      const getEventById = await EventModel.findOne({ _id: id })

      if (!getEventById) {
        return res.status(StatusCodes.NOT_FOUND).json({
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Event not found',
        })
      }

      await EventModel.deleteOne({ _id: id })

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Event successfully deleted',
      })
    } catch (error) {
      console.log(
        'Error while executing the endpoint for event deletion by ID',
        error,
      )

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error while executing the endpoint for event deletion by ID',
      })
    }
  }
}

export default EventController
