import { useState } from 'react'
import Button from '../ui/Button'
import Icon from '../ui/Icon'

const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })

// Aviso previo al vencimiento de la sesión, con opción de renovarla sin perder lo que se está editando.
export default function SessionExpiryBanner({ expiresAt, onRenew }) {
  const [renewing, setRenewing] = useState(false)
  const [failed, setFailed] = useState(false)

  const renew = async () => {
    setRenewing(true)
    setFailed(false)
    const renewed = await onRenew()
    setRenewing(false)
    setFailed(!renewed)
  }

  return (
    <div role="alert" className="border-b border-amber-200 bg-amber-50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-xs text-amber-900 sm:px-6 lg:px-8">
        <p className="flex items-center gap-2">
          <Icon name="clock" className="h-4 w-4 shrink-0" />
          Su sesión vence a las {formatTime(expiresAt)}. Guarde sus cambios o mantenga la sesión activa.
          {failed ? <span className="font-semibold"> No se pudo renovar; intente de nuevo.</span> : null}
        </p>
        <Button size="sm" onClick={renew} disabled={renewing}>
          {renewing ? 'Renovando…' : 'Mantener sesión'}
        </Button>
      </div>
    </div>
  )
}
