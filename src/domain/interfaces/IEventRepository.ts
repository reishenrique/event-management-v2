/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEntity } from '../entities/EventEntity'

export interface IEventRepository {
  createEvent(newEvent: EventEntity): any
  findEventByName(eventName: string): any
  findEventByCnpj(cnpj: string): any
}
