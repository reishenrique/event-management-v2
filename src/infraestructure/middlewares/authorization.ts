import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.SECRET

  const [scheme, token] = (req.headers.authorization ?? '').split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      statusCode: 401,
      message: 'Missing or malformed Authorization header',
    })
  }

  if (!secret) {
    console.error('SECRET is not configured; refusing to verify tokens')
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
    })
  }

  try {
    res.locals.token = jwt.verify(token, secret)
    next()
  } catch {
    return res.status(401).json({
      statusCode: 401,
      message: 'Invalid or expired token',
    })
  }
}

export default verifyToken
