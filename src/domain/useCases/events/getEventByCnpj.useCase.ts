import { UserEntity } from '../../entities/UserEntity'
import { IEventRepository } from '../../interfaces/IEventRepository'

export class GetEventByCnpjUseCase {
  constructor(private eventRepository: IEventRepository) {
    this.eventRepository = eventRepository
  }

  async execute(cnpj: string): Promise<UserEntity> {
    if (!cnpj) {
      throw new Error(
        'Event CNPJ is required to proceed with the search execution',
      )
    }

    const getEventByCnpj = await this.eventRepository.findEventByCnpj(cnpj)

    if (!getEventByCnpj) {
      throw new Error('Event not found or registered')
    }

    return getEventByCnpj
  }
}
