import { ROLES } from '../../data/mockData'
import Icon from '../ui/Icon'

export default function TopNavbar({ user, breadcrumb = [], onNavigate, onLogout }) {
  const roleLabel = user?.role === ROLES.ADMIN ? 'Administrador' : 'Docente'

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900 text-white">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold hover:bg-white/10"
            aria-label="Ir al inicio"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded bg-white/10">
              <Icon name="logo" className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">diagnostico-poo</span>
          </button>
          <span className="hidden text-slate-600 sm:inline">/</span>
          <ol className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {breadcrumb.map((item, index) => (
              <li key={`${item}-${index}`} className="flex shrink-0 items-center gap-1">
                <span className={`truncate text-xs ${index === breadcrumb.length - 1 ? 'text-slate-200' : 'text-slate-400'}`}>
                  {item}
                </span>
                {index < breadcrumb.length - 1 ? <Icon name="chevronRight" className="h-3.5 w-3.5 text-slate-600" /> : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-200">
                {roleLabel}
              </span>
              <span className="hidden max-w-40 truncate text-xs text-slate-300 lg:inline">{user.name}</span>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-2.5 py-1.5 text-xs font-semibold text-slate-100 hover:bg-white/10"
              >
                <Icon name="logout" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-deep"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
