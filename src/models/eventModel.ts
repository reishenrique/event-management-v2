import { Schema, model } from "mongoose";

interface IEventModel {
  eventName: string;
  descriptionEvent: string;
  date: Date;
  location: string;
  typeEvent: string;
  ticketPrice: number;
  venueCapacity: number;
  contactInformation: string;
  paymentMethods: string;
  createdAt: Date;
}

const eventModelSchema = new Schema<IEventModel>({
  eventName: { type: String, required: true },
  descriptionEvent: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  typeEvent: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  venueCapacity: { type: Number, required: true },
  contactInformation: { type: String, required: true },
  paymentMethods: { type: String, required: true },
  createdAt: { type: Date, require: true },
});

const EventModel = model<IEventModel>("Event", eventModelSchema);

export { EventModel };
