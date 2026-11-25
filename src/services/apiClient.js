// Cliente HTTP del backend (FastAPI). La URL se configura con VITE_API_URL en .env.local.
const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')
const LOGIN_PATH = '/api/auth/login'
const LOGOUT_PATH = '/api/auth/logout'
// Claves de localStorage. Se comparten entre pestañas del mismo navegador.
export const SESSION_TOKEN_KEY = 'diagnostico_poo_token'
const SESSION_EXPIRY_KEY = 'diagnostico_poo_expira'

// Se emite cuando el backend rechaza el token (expiró o la cuenta fue desactivada).
export const SESSION_EXPIRED_EVENT = 'diagnostico:sesion-expirada'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// La sesión se guarda en localStorage para que todas las pestañas la compartan hasta que venza o se
// cierre. El vencimiento se guarda en milisegundos desde la época Unix.
export const sessionToken = {
  read: () => window.localStorage.getItem(SESSION_TOKEN_KEY),
  readExpiry: () => {
    const value = Number(window.localStorage.getItem(SESSION_EXPIRY_KEY))
    return Number.isFinite(value) && value > 0 ? value : null
  },
  // El vencimiento se escribe antes que el token: las otras pestañas reaccionan al cambio del token.
  save: (token, expiresAt) => {
    window.localStorage.setItem(SESSION_EXPIRY_KEY, String(expiresAt))
    window.localStorage.setItem(SESSION_TOKEN_KEY, token)
  },
  clear: () => {
    window.localStorage.removeItem(SESSION_TOKEN_KEY)
    window.localStorage.removeItem(SESSION_EXPIRY_KEY)
  },
}

const FIELD_HINTS = {
  nombre: 'nombre',
  correo: 'correo electrónico (formato nombre@dominio.ec)',
  contrasena: 'contraseña (mínimo 10 caracteres)',
  rol: 'rol',
  activo: 'estado',
}

// FastAPI responde 422 con una lista de errores por campo; se resume en un mensaje en español.
function validationMessage(detail) {
  const fields = [...new Set(detail.map((item) => item?.loc?.at(-1)).filter((field) => FIELD_HINTS[field]))]
  if (fields.length === 0) return 'Revise los datos ingresados.'
  return `Revise: ${fields.map((field) => FIELD_HINTS[field]).join(', ')}.`
}

function errorMessage(status, data) {
  if (typeof data?.detail === 'string') return data.detail
  if (status === 422 && Array.isArray(data?.detail)) return validationMessage(data.detail)
  return 'No se pudo completar la solicitud. Intente de nuevo.'
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = {}
  const token = sessionToken.read()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.')
  }

  if (response.status === 204) return null
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 401 && path !== LOGIN_PATH && path !== LOGOUT_PATH) {
      sessionToken.clear()
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
    }
    throw new ApiError(response.status, errorMessage(response.status, data))
  }
  return data
}

export const authApi = {
  login: (correo, contrasena) => request(LOGIN_PATH, { method: 'POST', body: { correo, contrasena } }),
  currentSession: () => request('/api/auth/sesion'),
  logout: () => request(LOGOUT_PATH, { method: 'POST' }),
  renew: () => request('/api/auth/renovar', { method: 'POST' }),
}

export const usersApi = {
  list: () => request('/api/usuarios'),
  create: (user) => request('/api/usuarios', { method: 'POST', body: user }),
  update: (id, changes) => request(`/api/usuarios/${id}`, { method: 'PATCH', body: changes }),
  remove: (id) => request(`/api/usuarios/${id}`, { method: 'DELETE' }),
}
