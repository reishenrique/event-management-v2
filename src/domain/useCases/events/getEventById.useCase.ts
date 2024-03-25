import { EventEntity } from '../../entities/EventEntity'
import { IEventRepository } from '../../interfaces/IEventRepository'

export class GetEventByIdUseCase {
  constructor(private eventRepository: IEventRepository) {
    this.eventRepository = eventRepository
  }

  async execute(id: string): Promise<EventEntity> {
    if (!id) {
      throw new Error(
        'Event ID is required to proceed with the search execution',
      )
    }

    const getEventById = await this.eventRepository.findEventById(id)

    if (!getEventById) {
      throw new Error('Event ID not found')
    }

    return getEventById
  }
}
