import { Request, Response } from 'express'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { eventTypeEnum } from '../domain/enum/eventTypeEnum'
import { paymentMethodEnum } from '../domain/enum/paymentMethodEnum'
import { CreateEventUseCase } from '../domain/useCases/events/createEvent.useCase'
import { GetEventByIdUseCase } from '../domain/useCases/events/getEventById.useCase'
import { GetEventByCnpjUseCase } from '../domain/useCases/events/getEventByCnpj.useCase'
import { UpdateEventByIdUseCase } from '../domain/useCases/events/updateEventById.useCase'
import { DeleteEventByIdUseCase } from '../domain/useCases/events/deleteEventById.useCase'

interface IEventController {
  createEvent(req: Request, res: Response): Promise<object>
  getEventById(req: Request, res: Response): Promise<object>
  getEventByCnpj(req: Request, res: Response): Promise<object>
  updateEventById(req: Request, res: Response): Promise<object>
  deleteEventById(req: Request, res: Response): Promise<object>
}
export class EventController implements IEventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly getEventByIdUseCase: GetEventByIdUseCase,
    private readonly getEventByCnpjUseCase: GetEventByCnpjUseCase,
    private readonly updateEventByIdUseCase: UpdateEventByIdUseCase,
    private readonly deleteEventByIdUseCase: DeleteEventByIdUseCase,
  ) {
    this.createEvent = this.createEvent.bind(this)
    this.getEventById = this.getEventById.bind(this)
    this.getEventByCnpj = this.getEventByCnpj.bind(this)
    this.updateEventById = this.updateEventById.bind(this)
    this.deleteEventById = this.deleteEventById.bind(this)
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
    try {
      const { id } = req.params
      const getEventById = await this.getEventByIdUseCase.execute(id)

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
    try {
      const { cnpj } = req.params
      const getEventByCnpj = await this.getEventByCnpjUseCase.execute(cnpj)

      return res
        .status(StatusCodes.OK)
        .json({ statusCode: StatusCodes.OK, user: getEventByCnpj })
    } catch (error) {
      console.log(
        'Error while executing the endpoint to search for a event by CNPJ',
        error,
      )

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message:
          'Error while executing the endpoint to search for a event by CNPJ',
      })
    }
  }

  async updateEventById(req: Request, res: Response): Promise<object> {
    try {
      const { id } = req.params
      const newEventData = req.body

      const updatedEvent = await this.updateEventByIdUseCase.execute(
        id,
        newEventData,
      )

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Event data successfully updated',
        updatedEvent,
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
      await this.deleteEventByIdUseCase.execute(id)

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
