import { EventEntity } from '../../entities/EventEntity'
import { CustomError } from '../../errors/customError'
import { IEventRepository } from '../../interfaces/IEventRepository'

export class GetEventByIdUseCase {
  constructor(private eventRepository: IEventRepository) {
    this.eventRepository = eventRepository
  }

  async execute(id: string): Promise<EventEntity> {
    if (!id) {
      throw CustomError.BadRequestError(
        'Event ID is required to proceed with the search execution',
      )
    }

    const getEventById = await this.eventRepository.findEventById(id)

    if (!getEventById) {
      throw CustomError.NotFoundError('Event ID not found')
    }

    return getEventById
  }
}
