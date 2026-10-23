/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEntity } from '../../domain/entities/EventEntity'
import { CustomError } from '../../domain/errors/customError'
import { IEventRepository } from '../../domain/interfaces/IEventRepository'
import { EventModel } from '../../infraestructure/models/eventModel'
import { isDuplicateKeyError } from './mongoErrors'

export class EventRepository implements IEventRepository {
  async createEvent(newEvent: EventEntity): Promise<EventEntity> {
    try {
      const event = await EventModel.create(newEvent)
      return event
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw CustomError.ConflictError(
          'The CNPJ for event registration is already in use',
        )
      }

      throw error
    }
  }

  async findEventByName(eventName: string): Promise<any> {
    const eventExistsByName = await EventModel.findOne({ eventName })
    return eventExistsByName
  }

  async findEventByCnpj(cnpj: string): Promise<any> {
    const eventExistsByCnpj = await EventModel.findOne({ cnpj })
    return eventExistsByCnpj
  }

  async findEventById(id: string): Promise<any> {
    const eventExistsById = await EventModel.findById(id)
    return eventExistsById
  }

  async findEventByIdAndUpdate(id: string, newEventData: any) {
    const findEventAndUpdate = await EventModel.findByIdAndUpdate(
      id,
      newEventData,
      {
        new: true,
      },
    )

    return findEventAndUpdate
  }

  async deleteEventById(id: string) {
    const findUserByIdAndDelete = await EventModel.deleteOne({ _id: id })
    return findUserByIdAndDelete
  }
}
