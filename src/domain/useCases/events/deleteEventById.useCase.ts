import { IEventRepository } from '../../interfaces/IEventRepository'

export class DeleteEventByIdUseCase {
  constructor(private eventRepository: IEventRepository) {
    this.eventRepository = eventRepository
  }

  async execute(id: string) {
    const getEventById = await this.eventRepository.findEventById(id)

    if (!getEventById) {
      throw new Error('Event not found')
    }

    await this.eventRepository.deleteEventById(id)
  }
}
