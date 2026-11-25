import { useCallback, useEffect, useState } from 'react'
import { usersApi } from '../services/apiClient'
import { toApiNewUser, toApiUserChanges, toUiUser } from '../services/userMapper'

// Cuentas reales del backend para el panel "Cuentas y roles" del administrador.
// Cada operación devuelve { ok, message } para que la vista muestre el resultado.
export function useAccounts() {
  const [accounts, setAccounts] = useState([])
  const [status, setStatus] = useState('loading')
  const [loadError, setLoadError] = useState('')

  const applyResult = useCallback((data) => {
    setAccounts(data.map(toUiUser))
    setLoadError('')
    setStatus('ready')
  }, [])

  const applyError = useCallback((caught) => {
    setLoadError(caught.message)
    setStatus('error')
  }, [])

  const reload = useCallback(
    () => usersApi.list().then(applyResult).catch(applyError),
    [applyResult, applyError],
  )

  // Carga inicial: el estado se actualiza cuando llega la respuesta, no dentro del efecto.
  useEffect(() => {
    let cancelled = false
    usersApi
      .list()
      .then((data) => {
        if (!cancelled) applyResult(data)
      })
      .catch((caught) => {
        if (!cancelled) applyError(caught)
      })
    return () => {
      cancelled = true
    }
  }, [applyResult, applyError])

  const run = useCallback(
    async (action) => {
      try {
        await action()
      } catch (caught) {
        return { ok: false, message: caught.message }
      }
      await reload()
      return { ok: true, message: '' }
    },
    [reload],
  )

  const createAccount = useCallback((form) => run(() => usersApi.create(toApiNewUser(form))), [run])
  const updateAccount = useCallback((id, form) => run(() => usersApi.update(id, toApiUserChanges(form))), [run])
  const setAccountActive = useCallback((id, active) => run(() => usersApi.update(id, { activo: active })), [run])
  const deleteAccount = useCallback((id) => run(() => usersApi.remove(id)), [run])

  return { accounts, status, loadError, reload, createAccount, updateAccount, setAccountActive, deleteAccount }
}
