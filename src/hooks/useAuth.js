import { useCallback, useEffect, useState } from 'react'
import { ROLES } from '../data/mockData'
import { ApiError, authApi, SESSION_EXPIRED_EVENT, SESSION_TOKEN_KEY, sessionToken } from '../services/apiClient'
import { toUiUser } from '../services/userMapper'

const SESSION_EXPIRED_MESSAGE = 'La sesión expiró o fue cerrada. Inicie sesión nuevamente.'
// Minutos antes del vencimiento en que se avisa al usuario para que guarde o renueve la sesión.
const EXPIRY_WARNING_MS = 5 * 60 * 1000
// setTimeout no admite esperas mayores a 2^31 - 1 ms (unos 24 días).
const MAX_TIMER_MS = 2 ** 31 - 1

// Sesión guardada en el navegador; se descarta si ya venció.
function readStoredSession() {
  const token = sessionToken.read()
  const expiresAt = sessionToken.readExpiry()
  if (!token || !expiresAt || expiresAt <= Date.now()) {
    sessionToken.clear()
    return null
  }
  return { token, expiresAt }
}

const timerDelay = (ms) => Math.min(Math.max(0, ms), MAX_TIMER_MS)

export function useAuth() {
  const [storedSession] = useState(readStoredSession)
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [isRestoring, setIsRestoring] = useState(() => storedSession !== null)
  const [expiresAt, setExpiresAt] = useState(() => storedSession?.expiresAt ?? null)
  const [isExpiringSoon, setIsExpiringSoon] = useState(false)

  const endSession = useCallback((message) => {
    sessionToken.clear()
    setUser(null)
    setExpiresAt(null)
    setIsExpiringSoon(false)
    setError(message)
  }, [])

  // Restaura la sesión al recargar o al abrir otra pestaña si el token sigue siendo válido.
  useEffect(() => {
    if (!storedSession) return undefined
    let cancelled = false
    authApi
      .currentSession()
      .then((apiUser) => {
        if (!cancelled) setUser(toUiUser(apiUser))
      })
      .catch(() => {
        // Un 401 ya dispara SESSION_EXPIRED_EVENT, que limpia la sesión.
      })
      .finally(() => {
        if (!cancelled) setIsRestoring(false)
      })
    return () => {
      cancelled = true
    }
  }, [storedSession])

  // El backend rechazó el token durante el uso (sesión cerrada, vencida o cuenta desactivada).
  useEffect(() => {
    const handleExpired = () => endSession(SESSION_EXPIRED_MESSAGE)
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired)
  }, [endSession])

  // Aviso previo y cierre automático al llegar la hora de vencimiento.
  useEffect(() => {
    if (!user || !expiresAt) return undefined
    const remaining = expiresAt - Date.now()
    const warningTimer = window.setTimeout(() => setIsExpiringSoon(true), timerDelay(remaining - EXPIRY_WARNING_MS))
    const expiryTimer = window.setTimeout(() => endSession(SESSION_EXPIRED_MESSAGE), timerDelay(remaining))
    return () => {
      window.clearTimeout(warningTimer)
      window.clearTimeout(expiryTimer)
    }
  }, [user, expiresAt, endSession])

  // Sincroniza las pestañas: iniciar, renovar o cerrar sesión en una se refleja en las demás.
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== SESSION_TOKEN_KEY && event.key !== null) return
      if (!sessionToken.read()) {
        setUser(null)
        setExpiresAt(null)
        setIsExpiringSoon(false)
        return
      }
      setExpiresAt(sessionToken.readExpiry())
      setIsExpiringSoon(false)
      authApi
        .currentSession()
        .then((apiUser) => setUser(toUiUser(apiUser)))
        .catch(() => {})
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = useCallback(async (email, password) => {
    setError('')
    try {
      const { token, expira_en: expiresIso, usuario } = await authApi.login(email.trim(), password)
      const expiry = Date.parse(expiresIso)
      sessionToken.save(token, expiry)
      const account = toUiUser(usuario)
      setExpiresAt(expiry)
      setIsExpiringSoon(false)
      setUser(account)
      return account
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'No se pudo iniciar sesión.')
      return null
    }
  }, [])

  // Avisa al backend para que el token deje de valer; la sesión local se cierra aunque falle.
  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Sin conexión con el backend la sesión del servidor vencerá sola.
    }
    endSession('')
  }, [endSession])

  // Reemplaza la sesión por una nueva con otro vencimiento. Devuelve true si se renovó.
  const renew = useCallback(async () => {
    try {
      const { token, expira_en: expiresIso } = await authApi.renew()
      const expiry = Date.parse(expiresIso)
      sessionToken.save(token, expiry)
      setExpiresAt(expiry)
      setIsExpiringSoon(false)
      return true
    } catch {
      return false
    }
  }, [])

  return {
    user,
    error,
    isRestoring,
    expiresAt,
    isExpiringSoon,
    login,
    logout,
    renew,
    isAuthenticated: user !== null,
    isAdmin: user?.role === ROLES.ADMIN,
    isTeacher: user?.role === ROLES.TEACHER,
  }
}
