import { useState } from 'react'
import Button from '../components/ui/Button'
import GhBox from '../components/ui/GhBox'
import Icon from '../components/ui/Icon'
import MethodologicalBanner from '../components/ui/MethodologicalBanner'

export default function LoginPage({ onLogin, error, onNavigate }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await onLogin(credentials.email, credentials.password)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
      <div className="flex flex-col justify-center">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand">acceso-institucional</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Su espacio de diagnóstico pedagógico
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
          Ingrese con su cuenta institucional para gestionar grupos, analizar entregables Python y consultar
          diagnósticos por pilar. No hay registro público ni recuperación de contraseña en este prototipo.
        </p>
        <MethodologicalBanner tone="estimation" title="Uso responsable de la información" className="mt-6">
          Los diagnósticos apoyan la tutoría; no constituyen calificaciones académicas ni decisiones definitivas sobre
          el aprendizaje.
        </MethodologicalBanner>
      </div>

      <GhBox
        title="Iniciar sesión"
        subtitle="Use la cuenta asignada por el administrador del sistema."
        bodyClassName="p-5 sm:p-6"
      >
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-xs font-semibold text-slate-700">
            Correo electrónico
            <input
              type="email"
              autoComplete="username"
              autoFocus
              required
              value={credentials.email}
              onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
              placeholder="nombre@diagnostico.edu"
              className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-700">
            Contraseña
            <input
              type="password"
              autoComplete="current-password"
              required
              value={credentials.password}
              onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
            />
          </label>

          {error ? (
            <p role="alert" className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <Icon name="circleAlert" className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Verificando…' : 'Entrar'}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
        >
          <Icon name="chevronLeft" className="h-3.5 w-3.5" />
          Volver al inicio
        </button>
      </GhBox>
    </main>
  )
}
