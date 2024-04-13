/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatCnpj } from '../../../utils/formatCpfCnpj'
import { EventEntity } from '../../entities/EventEntity'
import { CustomError } from '../../errors/customError'
import { IEventRepository } from '../../interfaces/IEventRepository'

export class CreateEventUseCase {
  constructor(private eventRepository: IEventRepository) {
    this.eventRepository = eventRepository
  }

  async execute(event: EventEntity): Promise<EventEntity> {
    const { eventName, cnpj }: { eventName: string; cnpj: string } =
      event as any

    const eventExistsByEventName =
      await this.eventRepository.findEventByName(eventName)

    if (eventExistsByEventName) {
      throw CustomError.ConflictError('Event already registered in the system')
    }

    const formattedCnpj = formatCnpj(cnpj)

    const eventExistsByCNPJ =
      await this.eventRepository.findEventByCnpj(formattedCnpj)

    if (eventExistsByCNPJ) {
      throw CustomError.ConflictError(
        'The CNPJ for event registration is already in use',
      )
    }

    const newEvent = { ...event, cnpj: formattedCnpj }

    await this.eventRepository.createEvent(newEvent)

    return newEvent
  }
}
