import { ROLES } from '../data/mockData'

// El backend usa "administrador"/"docente" y nombres de campo en español; la interfaz usa ROLES y
// los nombres en inglés del prototipo. Toda la conversión entre ambos formatos vive aquí.
const ROLE_FROM_API = { administrador: ROLES.ADMIN, docente: ROLES.TEACHER }
const ROLE_TO_API = { [ROLES.ADMIN]: 'administrador', [ROLES.TEACHER]: 'docente' }

export const toUiUser = (apiUser) => ({
  id: apiUser.id,
  name: apiUser.nombre,
  email: apiUser.correo,
  role: ROLE_FROM_API[apiUser.rol],
  active: apiUser.activo,
})

export const toApiNewUser = (form) => ({
  nombre: form.name.trim(),
  correo: form.email.trim(),
  contrasena: form.password,
  rol: ROLE_TO_API[form.role],
  activo: form.active,
})

// Al editar, la contraseña solo se envía si se escribió una nueva.
export const toApiUserChanges = (form) => {
  const changes = {
    nombre: form.name.trim(),
    correo: form.email.trim(),
    rol: ROLE_TO_API[form.role],
    activo: form.active,
  }
  if (form.password) changes.contrasena = form.password
  return changes
}
