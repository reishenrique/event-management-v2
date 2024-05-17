/* eslint-disable eqeqeq */
import { Request, Response } from 'express'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { CreateUserUseCase } from '../domain/useCases/users/createUser.useCase'
import { GetUserByCpfUseCase } from '../domain/useCases/users/getUserByCpf.useCase'
import { GetUserByIdUseCase } from '../domain/useCases/users/getUserById.useCase'
import { UpdateUserByIdUseCase } from '../domain/useCases/users/updateUserById.useCase'
import { DeleteUserByIdUseCase } from '../domain/useCases/users/deleteUserById.useCase'
import { CustomError } from '../domain/errors/customError'

interface IUserController {
  createUser(req: Request, res: Response): Promise<object>
  getUserByCpf(req: Request, res: Response): Promise<object>
  getUserById(req: Request, res: Response): Promise<object>
  updateUserById(req: Request, res: Response): Promise<object>
  deleteUserById(req: Request, res: Response): Promise<object>
}

class UserController implements IUserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByCpfUseCase: GetUserByCpfUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserByIdUseCase: UpdateUserByIdUseCase,
    private readonly deleteUserByIdUseCase: DeleteUserByIdUseCase,
  ) {
    this.createUser = this.createUser.bind(this)
    this.getUserByCpf = this.getUserByCpf.bind(this)
    this.getUserById = this.getUserById.bind(this)
    this.updateUserById = this.updateUserById.bind(this)
    this.deleteUserById = this.deleteUserById.bind(this)
  }

  async createUser(req: Request, res: Response): Promise<object> {
    const userSchema = z.object({
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

    try {
      const user = userSchema.parse(req.body)
      const newUser = await this.createUserUseCase.execute(user)

      return res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: 'User created successfully',
        user: newUser,
      })
    } catch (error) {
      console.log('Error while executing the user creation endpoint', error)

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

  async getUserByCpf(req: Request, res: Response): Promise<object> {
    try {
      const { cpf } = req.params

      const getUserByCpf = await this.getUserByCpfUseCase.execute(cpf)

      return res
        .status(StatusCodes.OK)
        .json({ statusCode: StatusCodes.OK, user: getUserByCpf })
    } catch (error) {
      console.log(
        'Error while executing the endpoint to search for a user by CPF',
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

  async getUserById(req: Request, res: Response): Promise<object> {
    try {
      const { id } = req.params

      const getUserById = await this.getUserByIdUseCase.execute(id)

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        user: getUserById,
      })
    } catch (error) {
      console.log('Error while executing the user search endpoint by ID', error)

      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          message: error.message,
        })
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      })
    }
  }

  async updateUserById(req: Request, res: Response): Promise<object> {
    try {
      const { id } = req.params
      const newUserData = req.body

      const user = await this.updateUserByIdUseCase.execute(id, newUserData)

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'User data successfully updated',
        updatedUser: user,
      })
    } catch (error) {
      console.log(
        'Error while executing the endpoint for updating the user by ID',
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

  async deleteUserById(req: Request, res: Response): Promise<object> {
    try {
      const { id } = req.params
      await this.deleteUserByIdUseCase.execute(id)

      return res
        .status(StatusCodes.OK)
        .json({ message: 'User deleted successfully' })
    } catch (error) {
      console.log(
        'Error while executing the endpoint for user deletion by ID',
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
}

export default UserController
