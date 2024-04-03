import { CustomError } from '../../errors/customError'
import { IEventRepository } from '../../interfaces/IEventRepository'

export class UpdateEventByIdUseCase {
  constructor(private eventRepository: IEventRepository) {
    this.eventRepository = eventRepository
  }

  async execute(id: string, newDataEvent: string) {
    if (!id) {
      throw CustomError.BadRequestError(
        'Event ID is required to proceed with update execution',
      )
    }

    const findEventAndUpdate =
      await this.eventRepository.findEventByIdAndUpdate(id, newDataEvent)

    if (!findEventAndUpdate) {
      throw CustomError.NotFoundError('Event not found to perform data update')
    }

    return findEventAndUpdate
  }
}
