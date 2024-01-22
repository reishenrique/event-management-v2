import { z } from 'zod'

const envSchema = z.object({
  DATABASE_CONNECTION: z.string().url(),
  PORT: z.number(),
  DB_USER: z.string().optional(),
  DB_PASS: z.string().optional(),
})

export const env = envSchema.parse(process.env)
