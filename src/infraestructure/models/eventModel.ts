import { Schema, model } from 'mongoose'

interface IEventModel {
  eventName: string
  eventDescription: string
  cnpj: string
  location: string
  eventType: string
  eventTicketPrice: number
  venueCapacity: number
  contactInformation: string
  paymentMethodOption: string
}

const eventModelSchema = new Schema<IEventModel>({
  eventName: { type: String, required: true },
  eventDescription: { type: String, required: true },
  cnpj: { type: String, required: true },
  location: { type: String, required: true },
  eventType: { type: String, required: true },
  eventTicketPrice: { type: Number, required: true },
  venueCapacity: { type: Number, required: true },
  contactInformation: { type: String, required: true },
  paymentMethodOption: { type: String, required: true },
})

const EventModel = model<IEventModel>('Event', eventModelSchema)

export { EventModel }
