/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { UserModel } from '../models/userModel'

interface IUserController {
  createUser(req: Request, res: Response): Promise<any>
}

class UserController implements IUserController {
  public async createUser(req: Request, res: Response): Promise<object> {
    const userSchema = z.object({
      firstName: z.string({ required_error: 'Name is required' }).optional(),
      lastName: z.string({ required_error: 'Lastname is required' }).optional(),
      userName: z.string({ required_error: 'Username is required' }).optional(),
      cpf: z
        .string({ required_error: 'CPF is required' })
        .length(11, { message: 'The CPF need to contain 11 digits' })
        .optional(),
      cnpj: z
        .string({ required_error: 'CNPJ is required' })
        .length(14, { message: 'The CNPJ need contain 14 digits' })
        .optional(),
      emailAddress: z
        .string()
        .email({ message: 'Invalid email address' })
        .optional(),
      phoneNumber: z
        .string({ required_error: 'Phone Number is required' })
        .length(11, { message: 'The phone number must contain 11 digits' })
        .optional(),
      password: z
        .string({ required_error: 'Password is required' })
        .min(6, { message: 'The password must be contain at least 6 digits' })
        .max(15, {
          message: 'The password must contain a maximum of 15 digits',
        })
        .optional(),
      confirmPassword: z
        .string({
          required_error:
            'Password confirmation must be the same as the main password',
        })
        .optional(),
      dateOfBirth: z
        .string({ required_error: 'The date of birth is required' })
        .optional(),
      gender: z.enum(['Masculine', 'Feminine']).optional(),
    })

    try {
      const user = userSchema.parse(req.body)
      const { cpf, cnpj, emailAddress } = user

      const userExistsByCPF = await UserModel.findOne({ cpf })

      if (userExistsByCPF) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send('CPF already registered in the system')
      }

      const userExistsByCNPJ = await UserModel.findOne({ cnpj })

      if (userExistsByCNPJ) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send('CNPJ already registered in the system')
      }

      const userExistsByEmail = await UserModel.findOne({ emailAddress })

      if (userExistsByEmail) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send('E-mail already registered in the system')
      }

      const saltRounds = 10
      const hashPassword = bcrypt.hash(user.password as string, saltRounds)

      const matchPassword = user.password !== user.confirmPassword

      if (matchPassword) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send('The passwords do not match')
      }

      const newUser = {
        ...user,
        password: hashPassword,
      }

      await UserModel.create(newUser)
      return res
        .status(StatusCodes.CREATED)
        .send('User successfully registered')
    } catch (error) {
      console.log('Error when trying to create a user', error)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }
  }
}

export default UserController
