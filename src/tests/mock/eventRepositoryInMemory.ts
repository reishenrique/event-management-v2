import { EventEntity } from '../../domain/entities/EventEntity'
import { IEventRepository } from '../../domain/interfaces/IEventRepository'

export class EventRepositoryInMemory implements IEventRepository {
  private events: any[] = []
  constructor(events: any) {
    this.events = events
  }

  async createEvent(newEvent: EventEntity) {
    this.events.push(newEvent)
  }

  async findEventByName(eventName: string) {
    const event = this.events.find((event) => event.name === eventName)
    return event
  }

  async findEventByCnpj(cnpj: string) {
    const event = this.events.find((event) => event.cnpj === cnpj)
    return event
  }

  async findEventById(id: string) {
    const event = this.events.find((event) => event._id === id)
    return event
  }

  async findEventByIdAndUpdate(id: string, newEventData: any) {
    const index = this.events.findIndex((events) => events._id === id)
    if (index === -1) {
      return null
    }

    this.events[index] = { ...this.events[index], ...newEventData }
    return this.events[index]
  }

  async deleteEventById(id: string) {
    const index = this.events.findIndex((event) => event.id === id)
    if (index !== -1) {
      this.events.splice(index, 1)
    }
  }
}
