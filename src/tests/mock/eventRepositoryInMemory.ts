import { EventEntity } from '../../domain/entities/EventEntity'
import { IEventRepository } from '../../domain/interfaces/IEventRepository'

export class EventRepositoryInMemory implements IEventRepository {
  private events: any[] = []
  constructor(events: any) {
    this.events = events ?? []
  }

  async createEvent(newEvent: EventEntity) {
    this.events.push(newEvent)
  }

  async findEventByName(eventName: string) {
    const event = this.events.find((event) => event.eventName === eventName)
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

  async findEventByIdAndUpdate(id: string, newEventData: object) {
    const eventIndex = this.events.findIndex((event) => event._id === id)
    if (eventIndex !== -1) {
      this.events[eventIndex] = { ...this.events[eventIndex], ...newEventData }
      return this.events[eventIndex]
    }

    return null
  }

  async deleteEventById(id: string) {
    const index = this.events.findIndex((event) => event.id === id)
    if (index !== -1) {
      this.events.splice(index, 1)
    }
  }
}
