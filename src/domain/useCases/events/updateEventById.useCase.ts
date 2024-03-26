import { IEventRepository } from '../../interfaces/IEventRepository'

export class UpdateEventByIdUseCase {
  constructor(private eventRepository: IEventRepository) {
    this.eventRepository = eventRepository
  }

  async execute(id: string, newDataEvent: string) {
    if (!id) {
      throw new Error('Event ID is required to proceed with update execution')
    }

    const findEventAndUpdate =
      await this.eventRepository.findEventByIdAndUpdate(id, newDataEvent)

    if (!findEventAndUpdate) {
      throw new Error('Event not found to perform data update')
    }

    return findEventAndUpdate
  }
}
