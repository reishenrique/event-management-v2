import { Request, Response } from 'express'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
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
      gender: z.enum(['Masculine', 'Feminine']).optional(),
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
      console.log('Error while executing the user creation endpoint', error)

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }
  }

  async getUserByCpf(req: Request, res: Response): Promise<object> {
    const { cpf } = req.params

    if (!cpf) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('User ID is required to proceed with the search execution')
    }

    try {
      const userCpf = await UserModel.findOne({ cpf })

      if (!userCpf) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send('User not found or registered')
      }

      return res.status(StatusCodes.OK).json(userCpf)
    } catch (error) {
      console.log(
        'Error while executing the endpoint to search for a user by CPF',
        error,
      )

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }
  }

  async getUserById(req: Request, res: Response): Promise<object> {
    const { id } = req.params

    if (!id) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send('User ID is required to proceed with the search execution')
    }

    try {
      const userId = await UserModel.findById(id)

      if (!userId) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send('User ID not found or entered incorrectly')
      }

      return res.status(StatusCodes.OK).json(userId)
    } catch (error) {
      console.log('Error while executing the user search endpoint by ID', error)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }
  }

  async updateUserById(req: Request, res: Response): Promise<object> {
    try {
      const { id } = req.params
      const userUpdates = req.body

      const user = await UserModel.findByIdAndUpdate(id, userUpdates, {
        new: true,
      })

      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send('User not found for update')
      }

      return res
        .status(StatusCodes.OK)
        .json({ message: 'User data successfully updated' })
    } catch (error) {
      console.log(
        'Error while executing the endpoint for updating the user by ID',
        error,
      )

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }
  }

  async deleteUserById(req: Request, res: Response): Promise<object> {
    const { id } = req.params

    try {
      const user = await UserModel.findOne({ _id: id })

      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send('User not found or registered')
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

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }
  }
}

export default UserController
