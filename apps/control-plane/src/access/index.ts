import type { Access, FieldAccess } from 'payload'

type UserWithRole = {
  id: number | string
  role?: 'admin' | 'editor' | null
}

const getUser = (user: unknown): UserWithRole | null => {
  if (!user || typeof user !== 'object' || !('id' in user)) return null
  return user as UserWithRole
}

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const admins: Access = ({ req }) => getUser(req.user)?.role === 'admin'

export const adminsOrSelf: Access = ({ req }) => {
  const user = getUser(req.user)
  if (!user) return false
  if (user.role === 'admin') return true
  return { id: { equals: user.id } }
}

export const adminFieldAccess: FieldAccess = ({ req }) =>
  getUser(req.user)?.role === 'admin'

export const isAdminUser = (user: unknown): boolean =>
  getUser(user)?.role === 'admin'
