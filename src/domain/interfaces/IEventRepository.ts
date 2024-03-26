/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEntity } from '../entities/EventEntity'

export interface IEventRepository {
  createEvent(newEvent: EventEntity): any
  findEventByName(eventName: string): any
  findEventByCnpj(cnpj: string): any
  findEventById(id: string): any
  findEventByIdAndUpdate(id: string, newEventData: string): any
  deleteEventById(id: string): any
}
