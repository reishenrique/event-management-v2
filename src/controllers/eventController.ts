import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { CreateEventUseCase } from '../domain/useCases/events/createEvent.useCase'
import { GetEventByIdUseCase } from '../domain/useCases/events/getEventById.useCase'
import { GetEventByCnpjUseCase } from '../domain/useCases/events/getEventByCnpj.useCase'
import { UpdateEventByIdUseCase } from '../domain/useCases/events/updateEventById.useCase'
import { DeleteEventByIdUseCase } from '../domain/useCases/events/deleteEventById.useCase'
import { CustomError } from '../domain/errors/customError'
import { eventSchemaValidator } from '../application/validators/eventSchemaValidator'

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
    try {
      const event = eventSchemaValidator.parse(req.body)
      const newEvent = await this.createEventUseCase.execute(event)

      return res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: 'Event successfully registered',
        event: newEvent,
      })
    } catch (error) {
      console.log('Error while executing the event creation endpoint', error)

      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          message: error.message,
        })
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
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

      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          message: error.message,
        })
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
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

      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          message: error.message,
        })
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
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

      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          message: error.message,
        })
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
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

      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          message: error.message,
        })
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      })
    }
  }
}

export default EventController
