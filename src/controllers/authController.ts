/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express'
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { UserModel } from '../models/userModel'
import bcrypt from 'bcrypt'
import z from 'zod'

interface IAuthController {
  login(req: Request, res: Response): Promise<object>
}

class AuthController implements IAuthController {
  async login(req: Request, res: Response): Promise<object> {
    try {
      const loginSchema = z.object({
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

      const loginUser = loginSchema.parse(req.body)

      const secret = process.env.SECRET
      const { emailAddress, password } = loginUser

      const user = await UserModel.findOne({ emailAddress })
      // console.log(user)

      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).send('Unauthorized')
      }

      const isValidPassword = await bcrypt.compareSync(
        password as string,
        user!.password,
      )

      if (!isValidPassword) {
        return res.status(StatusCodes.UNAUTHORIZED).send('Invalid password')
      }

      const token = jwt.sign({ id: user._id }, secret || '', {
        expiresIn: '8h',
      })

      return res
        .status(StatusCodes.OK)
        .json({ message: 'Authentication successfully performed', token })
    } catch (error) {
      console.log(
        'Error while executing the user login/authentication endpoint',
        error,
      )

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }
}

export default AuthController
