import { z } from "zod";

export const userSchemaValidator = z.object({
    firstName: z.string({ required_error: 'Name is required' }),
    lastName: z.string({ required_error: 'Lastname is required' }),
    userName: z.string({ required_error: 'Username is required' }),
    cpf: z
        .string({ required_error: 'CPF is required' })
        .length(14, { message: 'The CPF need to contain 11 digits' }),
    emailAddress: z.string().email({ message: 'Invalid email address' }),
    phoneNumber: z
        .string({ required_error: 'Phone Number is required' })
        .length(11, { message: 'The phone number must contain 11 digits' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(6, { message: 'The password must be contain at least 6 digits' })
        .max(15, {
            message: 'The password must contain a maximum of 15 digits',
        }),
    confirmPassword: z.string({
        required_error:
            'Password confirmation must be the same as the main password',
    }),
    gender: z.enum(['Male', 'Female']),
})