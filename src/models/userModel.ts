import { Schema, model } from 'mongoose'

interface IUserModel {
  firstName: string
  lastName: string
  userName: string
  cpf: string
  password: string
  emailAddress: string
  phoneNumber: string
  gender: string
}

const userModelSchema = new Schema<IUserModel>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  cpf: { type: String, required: true },
  password: { type: String, required: false },
  emailAddress: { type: String, required: true },
  userName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: false },
})

const UserModel = model<IUserModel>('User', userModelSchema)

export { UserModel, IUserModel }
