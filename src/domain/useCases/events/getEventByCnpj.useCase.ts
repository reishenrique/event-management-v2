import { UserEntity } from '../../entities/UserEntity'
import { CustomError } from '../../errors/customError'
import { IEventRepository } from '../../interfaces/IEventRepository'

export class GetEventByCnpjUseCase {
  constructor(private eventRepository: IEventRepository) {
    this.eventRepository = eventRepository
  }

  async execute(cnpj?: string): Promise<UserEntity> {
    if (!cnpj || typeof cnpj !== 'string') {
      throw CustomError.BadRequestError(
        'Event CNPJ is required to proceed with the search execution',
      )
    }

    const getEventByCnpj = await this.eventRepository.findEventByCnpj(cnpj)

    if (!getEventByCnpj) {
      throw CustomError.NotFoundError('Event not found or registered')
    }

    return getEventByCnpj
  }
}
