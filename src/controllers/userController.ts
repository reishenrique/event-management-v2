/* eslint-disable eqeqeq */
import { Request, Response } from 'express'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { UserModel } from '../models/userModel'
import { CreateUserUseCase } from '../domain/useCases/users/createUser.useCase'
import { GetUserByCpfUseCase } from '../domain/useCases/users/getUserByCpf.useCase'
import { GetUserByIdUseCase } from '../domain/useCases/users/getUserById.useCase'
import UpdateUserByIdUseCase from '../domain/useCases/users/updateUserById.useCase'

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
  ) {
    this.createUser = this.createUser.bind(this)
    this.getUserByCpf = this.getUserByCpf.bind(this)
    this.getUserById = this.getUserById.bind(this)
    this.updateUserById = this.updateUserById.bind(this)
  }

  async createUser(req: Request, res: Response): Promise<object> {
    const userSchema = z.object({
      firstName: z.string({ required_error: 'Name is required' }).optional(),
      lastName: z.string({ required_error: 'Lastname is required' }).optional(),
      userName: z.string({ required_error: 'Username is required' }).optional(),
      cpf: z
        .string({ required_error: 'CPF is required' })
        .length(11, { message: 'The CPF need to contain 11 digits' })
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
      gender: z.enum(['Male', 'Female']).optional(),
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

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error occurred while executing the user creation endpoint',
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

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message:
          'Error occurred while executing the endpoint for searching users by CPF',
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

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error while executing the user search endpoint by ID',
      })
    }
  }

  async updateUserById(req: Request, res: Response): Promise<object> {
    try {
      const { id } = req.params
      const newData = req.body

      const user = await this.updateUserByIdUseCase.execute(id, newData)

      // if (!user) {
      //   return res.status(StatusCodes.NOT_FOUND).json({
      //     statusCode: StatusCodes.NOT_FOUND,
      //     message: 'User not found for update',
      //   })
      // }

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

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message:
          'Error while executing the endpoint for updating the user by ID',
      })
    }
  }

  async deleteUserById(req: Request, res: Response): Promise<object> {
    const { id } = req.params

    try {
      const getUserById = await UserModel.findOne({ _id: id })

      if (!getUserById) {
        return res.status(StatusCodes.NOT_FOUND).json({
          statusCode: StatusCodes.NOT_FOUND,
          message: 'User not found or registered',
        })
      }

      await UserModel.deleteOne({ _id: id })
      return res
        .status(StatusCodes.OK)
        .json({ message: 'User deleted successfully' })
    } catch (error) {
      console.log(
        'Error while executing the endpoint for user deletion by ID',
        error,
      )

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error while executing the endpoint for user deletion by ID ',
      })
    }
  }
}

export default UserController
