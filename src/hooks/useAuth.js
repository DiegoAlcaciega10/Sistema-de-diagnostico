import { useCallback, useState } from 'react'
import { ROLES } from '../data/mockData'

export function useAuth(users) {
  const [userId, setUserId] = useState(null)
  const [error, setError] = useState('')
  const user = users.find((candidate) => candidate.id === userId) ?? null

  const login = useCallback(
    (email, password) => {
      const normalized = email.trim().toLowerCase()
      const account = users.find((candidate) => candidate.email.toLowerCase() === normalized)

      if (!account) {
        setError('No encontramos una cuenta con ese correo electrónico.')
        return null
      }
      if (!account.active) {
        setError('La cuenta está inactiva. Solicite su reactivación al administrador.')
        return null
      }
      if (account.password !== password) {
        setError('La contraseña no es correcta.')
        return null
      }

      setUserId(account.id)
      setError('')
      return account
    },
    [users],
  )

  const logout = useCallback(() => {
    setUserId(null)
    setError('')
  }, [])

  return {
    user,
    error,
    login,
    logout,
    isAuthenticated: user !== null,
    isAdmin: user?.role === ROLES.ADMIN,
    isTeacher: user?.role === ROLES.TEACHER,
  }
}
