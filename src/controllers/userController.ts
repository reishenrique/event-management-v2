import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { UserModel } from "../models/userModel";

interface IUserController {
  createUser(req: Request, res: Response): Promise<object>;
}

class UserController implements IUserController {
  async createUser(req: Request, res: Response): Promise<object> {
    const userSchema = z.object({
      firstName: z.string({ required_error: "Name is required" }).optional(),
      lastName: z.string({ required_error: "Lastname is required" }).optional(),
      userName: z.string({ required_error: "Username is required" }).optional(),
      cpf: z.string({ required_error: "CPF is required" }).optional(),
      emailAddress: z
        .string({ required_error: "Email is required" })
        .email()
        .optional(),
      phoneNumber: z
        .string({ required_error: "Phone Number is required" })
        .optional(),
      password: z.string({ required_error: "Password is required" }).optional(),
      confirmPassword: z
        .string({
          required_error:
            "Password confirmation must be the same as the main password",
        })
        .optional(),
      dateOfBirth: z.date().optional(),
      gender: z.enum(["Masculine", "Feminine"]).optional(),
    });

    try {
      const user = userSchema.parse(req.body);
      const { cpf } = user;

      const saltRounds = 10;
      const hashPassword = bcrypt.hash(user.password as string, saltRounds);

      const userExistsByCPF = await UserModel.findOne({ cpf });

      if (userExistsByCPF) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send("CPF already registered in the system");
      }

      const matchPassword = user.password !== user.confirmPassword;

      if (matchPassword) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send("The passwords do not match");
      }

      const newUser = { ...user, password: hashPassword };

      await UserModel.create(newUser);
      return res.status(StatusCodes.OK).send("User successfully registered");
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
  }
}

export default UserController;
