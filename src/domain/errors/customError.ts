import { StatusCodes } from 'http-status-codes'

export class CustomError extends Error {
  public readonly statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }

  static BadRequestError(message: string): CustomError {
    return new CustomError(message, StatusCodes.BAD_REQUEST)
  }

  static InternalServerError(message: string): CustomError {
    return new CustomError(message, StatusCodes.INTERNAL_SERVER_ERROR)
  }

  static NotFoundError(message: string): CustomError {
    return new CustomError(message, StatusCodes.NOT_FOUND)
  }

  static UnauthorizedError(message: string): CustomError {
    return new CustomError(message, StatusCodes.UNAUTHORIZED)
  }

  static ConflictError(message: string): CustomError {
    return new CustomError(message, StatusCodes.CONFLICT)
  }
}
