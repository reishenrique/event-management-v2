import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.SECRET

  const tokenHeader = req.headers.authorization
  // console.log('TokenHeader:', tokenHeader)

  const token = tokenHeader && tokenHeader.split(' ')[1]
  // console.log('Token:', token)

  if (!token) {
    return next(new Error('Token unauthorized'))
  }

  try {
    const decodedToken = jwt.verify(token, secret || '')
    res.locals.token = decodedToken

    next()
  } catch (error) {
    console.log(
      'Error when executing token verification, invalid JWT signature',
    )
    next(error)
  }
}

export default verifyToken
