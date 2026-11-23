// Cliente HTTP del backend (FastAPI). La URL se configura con VITE_API_URL en .env.local.
const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')
const TOKEN_KEY = 'diagnostico_poo_token'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// El token vive solo mientras la pestaña está abierta (sessionStorage).
export const sessionToken = {
  read: () => window.sessionStorage.getItem(TOKEN_KEY),
  save: (token) => window.sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => window.sessionStorage.removeItem(TOKEN_KEY),
}

function errorMessage(status, data) {
  if (typeof data?.detail === 'string') return data.detail
  if (status === 422) return 'Revise los datos ingresados.'
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

  const data = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status, errorMessage(response.status, data))
  return data
}

export const authApi = {
  login: (correo, contrasena) => request('/api/auth/login', { method: 'POST', body: { correo, contrasena } }),
  currentSession: () => request('/api/auth/sesion'),
}
