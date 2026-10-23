import { EventEntity } from '../../entities/EventEntity'
import { CustomError } from '../../errors/customError'
import { IEventRepository } from '../../interfaces/IEventRepository'
import { formatCnpj } from '../../../infraestructure/utils/formatCpfCnpj'

export class GetEventByCnpjUseCase {
  constructor(private eventRepository: IEventRepository) {
    this.eventRepository = eventRepository
  }

  async execute(cnpj?: string): Promise<EventEntity> {
    if (!cnpj || typeof cnpj !== 'string') {
      throw CustomError.BadRequestError(
        'Event CNPJ is required to proceed with the search execution',
      )
    }

    const normalizedCnpj = formatCnpj(cnpj)
    const getEventByCnpj =
      await this.eventRepository.findEventByCnpj(normalizedCnpj)

    if (!getEventByCnpj) {
      throw CustomError.NotFoundError('Event not found or registered')
    }

    return getEventByCnpj
  }
}
