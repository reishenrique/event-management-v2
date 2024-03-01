import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.SECRET

  const tokenHeader = req.headers.authorization
  // console.log('TokenHeader:', tokenHeader)

  const token = tokenHeader && tokenHeader.split(' ')[1]
  // console.log('Token:', token)

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Token not provided' })
  }

  try {
    jwt.verify(token, secret || '')

    next()
  } catch (error) {
    console.log('Error while executing the verify token endpoint', error)

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Invalid Token' })
  }
}

export default verifyToken
