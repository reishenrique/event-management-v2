/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { UserModel } from '../models/userModel'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import z from 'zod'
import 'dotenv/config'

interface IAuthController {
  login(req: Request, res: Response): Promise<object>
  authenticated(req: Request, res: Response): Promise<object>
}

const secret = process.env.SECRET

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

      const token = jwt.sign(
        { id: user._id, email: user.emailAddress },
        secret || '',
        {
          expiresIn: '8h',
        },
      )

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

  async authenticated(_req: Request, res: Response): Promise<object> {
    return res
      .status(StatusCodes.OK)
      .json({ statusCode: 200, message: 'Token authenticated' })
  }
}

export default AuthController
