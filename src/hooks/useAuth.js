import { useCallback, useEffect, useState } from 'react'
import { ROLES } from '../data/mockData'
import { ApiError, authApi, sessionToken } from '../services/apiClient'

// El backend usa los roles "administrador" y "docente"; la interfaz usa las constantes de ROLES.
const ROLE_FROM_API = { administrador: ROLES.ADMIN, docente: ROLES.TEACHER }

const toUiUser = (apiUser) => ({
  id: apiUser.id,
  name: apiUser.nombre,
  email: apiUser.correo,
  role: ROLE_FROM_API[apiUser.rol],
  active: apiUser.activo,
})

export function useAuth() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [isRestoring, setIsRestoring] = useState(() => Boolean(sessionToken.read()))

  // Restaura la sesión al recargar la página si el token sigue siendo válido.
  useEffect(() => {
    if (!sessionToken.read()) return undefined
    let cancelled = false
    authApi
      .currentSession()
      .then((apiUser) => {
        if (!cancelled) setUser(toUiUser(apiUser))
      })
      .catch(() => sessionToken.clear())
      .finally(() => {
        if (!cancelled) setIsRestoring(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setError('')
    try {
      const { token, usuario } = await authApi.login(email.trim(), password)
      sessionToken.save(token)
      const account = toUiUser(usuario)
      setUser(account)
      return account
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'No se pudo iniciar sesión.')
      return null
    }
  }, [])

  const logout = useCallback(() => {
    sessionToken.clear()
    setUser(null)
    setError('')
  }, [])

  return {
    user,
    error,
    isRestoring,
    login,
    logout,
    isAuthenticated: user !== null,
    isAdmin: user?.role === ROLES.ADMIN,
    isTeacher: user?.role === ROLES.TEACHER,
  }
}
