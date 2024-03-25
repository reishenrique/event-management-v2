/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEntity } from '../../entities/EventEntity'
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
      throw new Error('Event already registered in the system')
    }

    const eventExistsByCNPJ = await this.eventRepository.findEventByCnpj(cnpj)

    if (eventExistsByCNPJ) {
      throw new Error('The CNPJ for event registration is already in use')
    }

    const newEvent = event
    await this.eventRepository.createEvent(newEvent)

    return newEvent
  }
}
