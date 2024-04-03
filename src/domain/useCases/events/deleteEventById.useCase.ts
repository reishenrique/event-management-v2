import { CustomError } from '../../errors/customError'
import { IEventRepository } from '../../interfaces/IEventRepository'

export class DeleteEventByIdUseCase {
  constructor(private eventRepository: IEventRepository) {
    this.eventRepository = eventRepository
  }

  async execute(id: string) {
    const getEventById = await this.eventRepository.findEventById(id)

    if (!getEventById) {
      throw CustomError.NotFoundError('Event not found')
    }

    await this.eventRepository.deleteEventById(id)
  }
}
