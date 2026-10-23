import { z } from "zod";

export const userSchemaValidator = z.object({
    firstName: z.string({ required_error: 'Name is required' }),
    lastName: z.string({ required_error: 'Lastname is required' }),
    userName: z.string({ required_error: 'Username is required' }),
    cpf: z
        .string({ required_error: 'CPF is required' })
        .transform((value) => value.replace(/\D/g, ''))
        .refine((value) => value.length === 11, {
            message: 'The CPF must contain 11 digits',
        }),
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

/**
 * Update is an allowlist on purpose: fields like password, cpf and
 * emailAddress must change through their own verified flows.
 */
export const updateUserSchemaValidator = userSchemaValidator
    .pick({
        firstName: true,
        lastName: true,
        userName: true,
        phoneNumber: true,
        gender: true,
    })
    .partial()
    .strict()