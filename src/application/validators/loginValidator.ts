import { z } from "zod";

export const loginSchemaValidator = z.object({
    emailAddress: z
        .string()
        .email({ message: 'Invalid email address' })
        .optional(),
    password: z
        .string({ required_error: 'Password is required' })
        .min(6, { message: 'The password must be contain at least 6 digits' })
        .max(15, {
            message: 'The password must contain a maximum of 15 digits',
        })
        .optional(),
})
