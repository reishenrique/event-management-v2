import { Request, Response } from "express";
import { z } from "zod";

interface IEventController {
  createEvent(req: Request, res: Response);
}
export class EventController implements IEventController {
  async createEvent(req: Request, res: Response) {
    const eventSchema = z.object({
      eventName: z
        .string({ required_error: "Event name is required" })
        .optional(),
      eventDescription: z
        .string({ required_error: "Description is required" })
        .optional(),
      date: z
        .date({ required_error: "Event date and time are required" })
        .optional(),
      eventLocation: z
        .string({ required_error: "Event location is required" })
        .optional(),
      eventType: z
        .string({ required_error: "Event type is required" })
        .optional(),
      eventTicketPrice: z
        .string({
          required_error: "The event ticket price is required",
        })
        .optional(),
      venueCapacity: z
        .number({
          required_error: "The venue capacity for the event is required",
        })
        .optional(),
      contactInformation: z.string().optional(),
    });

    const event = eventSchema.parse(req.body);
  }
}
