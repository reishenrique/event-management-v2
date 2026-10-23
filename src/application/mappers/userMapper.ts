import type { UserEntity } from '../../domain/entities/UserEntity'

type UserLike = UserEntity & { _id?: unknown; id?: unknown }

export interface PublicUser {
  id: string
  firstName?: string
  lastName?: string
  userName?: string
  cpf?: string
  emailAddress?: string
  phoneNumber?: string
  gender?: string
}

/**
 * Explicit output contract. Never serialize the persistence document directly:
 * the schema may gain fields (password, reset tokens, roles) that must not
 * become part of the public API by accident.
 */
export const toPublicUser = (user: UserLike): PublicUser => ({
  id: String(user._id ?? user.id ?? ''),
  firstName: user.firstName,
  lastName: user.lastName,
  userName: user.userName,
  cpf: user.cpf,
  emailAddress: user.emailAddress,
  phoneNumber: user.phoneNumber,
  gender: user.gender,
})
