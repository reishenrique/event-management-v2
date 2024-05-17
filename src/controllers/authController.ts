/* eslint-disable @typescript-eslint/no-non-null-assertion */
import z from 'zod'
import 'dotenv/config'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { LoginUseCase } from '../domain/useCases/auth/login.useCase'
import { CustomError } from '../domain/errors/customError'

interface IAuthController {
  login(req: Request, res: Response): Promise<object>
  authenticated(req: Request, res: Response): Promise<object>
}

class AuthController implements IAuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {
    this.login = this.login.bind(this)
  }

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
      const token = await this.loginUseCase.execute(loginUser)

      return res.status(StatusCodes.OK).json({
        message: 'Authentication successfully performed',
        token,
      })
    } catch (error) {
      console.log(
        'Error while executing the user login/authentication endpoint',
        error,
      )

      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          message: error.message,
        })
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      })
    }
  }

  async authenticated(_req: Request, res: Response): Promise<object> {
    try {
      return res
        .status(StatusCodes.OK)
        .json({ statusCode: 200, message: 'Token authenticated' })
    } catch (error) {
      console.log('Error while executing the authentication')

      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          message: error.message,
        })
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      })
    }
  }
}

export default AuthController
