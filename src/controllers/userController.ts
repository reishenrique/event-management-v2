import { Request, Response } from 'express'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import { UserModel } from '../models/userModel'

interface IUserController {
  createUser(req: Request, res: Response): Promise<object>
  getUserByCpf(req: Request, res: Response): Promise<object>
  getUserById(req: Request, res: Response): Promise<object>
  updateUserById(req: Request, res: Response): Promise<object>
  deleteUserById(req: Request, res: Response): Promise<object>
}

class UserController implements IUserController {
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
      const { cpf, emailAddress } = user

      const userExistsByCPF = await UserModel.findOne({ cpf })

      if (userExistsByCPF) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send('CPF already registered in the system')
      }

      const userExistsByEmail = await UserModel.findOne({ emailAddress })

      if (userExistsByEmail) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send('E-mail already registered in the system')
      }

      const saltRounds = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(
        user.password as string,
        saltRounds,
      )

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
    const { cpf } = req.params

    if (!cpf) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'User ID is required to proceed with the search execution',
      })
    }

    try {
      const getUserByCpf = await UserModel.findOne({ cpf })

      if (!getUserByCpf) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'User not found or registered' })
      }

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
    const { id } = req.params

    if (!id) {
      return res.status(StatusCodes.NOT_FOUND).json({
        statusCode: StatusCodes.NOT_FOUND,
        message: 'User ID is required to proceed with the search execution',
      })
    }

    try {
      const getUserById = await UserModel.findById(id)

      if (!getUserById) {
        return res.status(StatusCodes.NOT_FOUND).json({
          statusCode: StatusCodes.NOT_FOUND,
          message: 'User ID not found or entered incorrectly',
        })
      }

      return res
        .status(StatusCodes.OK)
        .json({ statusCode: StatusCodes.OK, user: getUserById })
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
      const dataUserUpdate = req.body

      const user = await UserModel.findByIdAndUpdate(id, dataUserUpdate, {
        new: true,
      })

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          statusCode: StatusCodes.NOT_FOUND,
          message: 'User not found for update',
        })
      }

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
