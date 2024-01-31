import { Schema, model } from 'mongoose'

interface IUserModel {
  firstName: string
  lastName: string
  userName: string
  cpf: string
  emailAddress: string
  phoneNumber: string
  dateOfBirth: Date
  gender: string
}

const userModelSchema = new Schema<IUserModel>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  cpf: { type: String, required: true },
  emailAddress: { type: String, required: true },
  userName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: false },
})

const UserModel = model<IUserModel>('User', userModelSchema)

export { UserModel, IUserModel }
