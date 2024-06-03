import 'dotenv/config'
import jwt from 'jsonwebtoken'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateAcessToken = (user: any) => {
  const payload = {
    id: user._id,
    email: user.emailAddress,
  }

  const secret = process.env.SECRET as string

  const expiresIn: jwt.SignOptions = {
    expiresIn: '8h',
  }

  const token = jwt.sign(payload, secret, expiresIn)

  return token
}
