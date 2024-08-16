import { z } from "zod";
import { eventTypeEnum } from "../../domain/enum/eventTypeEnum";
import { paymentMethodEnum } from "../../domain/enum/paymentMethodEnum";

export const eventSchemaValidator = z.object({
    eventName: z.string({ required_error: 'Event name is required' }),
    eventDescription: z.string({ required_error: 'Description is required' }),
    cnpj: z
        .string({ required_error: 'CNPJ is required' })
        .length(18, { message: 'The CNPJ need contain 14 digits' }),
    location: z.string({ required_error: 'Location is required' }),
    eventType: z.enum(
        [
            eventTypeEnum.ACADEMIC_EDUCATIONAL_EVENT,
            eventTypeEnum.CORPORATE_EVENT,
            eventTypeEnum.CULTURAL_ENTERTAINMENT_EVENT,
            eventTypeEnum.RELIGIOUS_EVENT,
            eventTypeEnum.SOCIAL_EVENT,
            eventTypeEnum.SPORTING_EVENT,
        ],
        {
            required_error: 'A type of event needs to be one of those available',
        },
    ),
    eventTicketPrice: z.number({
        required_error: 'The event ticket price is required',
    }),
    venueCapacity: z.number({
        required_error: 'The venue capacity for the event is required',
    }),
    contactInformation: z.string({
        required_error: 'Contact Information is required ',
    }),
    paymentMethodOption: z.enum(
        [
            paymentMethodEnum.CREDIT,
            paymentMethodEnum.DEBIT,
            paymentMethodEnum.BANK_SLIP,
        ],
        {
            required_error:
                'The payment method needs to be one of those available',
        },
    ),
})