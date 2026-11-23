import { useCallback, useState } from 'react'
import TopNavbar from './components/layout/TopNavbar'
import { ROLES } from './data/mockData'
import { useAuth } from './hooks/useAuth'
import { useDiagnosisStore } from './hooks/useDiagnosisStore'
import AdminDashboard from './pages/AdminDashboard'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import TeacherDashboard from './pages/TeacherDashboard'

export default function App() {
  const store = useDiagnosisStore()
  const auth = useAuth()
  const [view, setView] = useState('landing')
  const [adminTab, setAdminTab] = useState(null)
  const [selectedGroupId, setSelectedGroupId] = useState(store.groups[0]?.id)

  const activeGroup = store.groups.find((group) => group.id === selectedGroupId) ?? store.groups[0]
  const breadcrumb =
    view === 'teacher'
      ? ['docente', `NRC-${activeGroup?.nrc ?? '…'}-${activeGroup?.subject.split(' ')[0] ?? 'POO'}`]
      : view === 'admin'
        ? ['admin', 'gobernanza']
        : view === 'login'
          ? ['acceso', 'login']
          : ['sistema', 'diagnóstico']

  const navigate = useCallback(
    (nextView, tab) => {
      const role = auth.user?.role
      if (nextView === 'admin' && role !== ROLES.ADMIN) {
        setView('login')
        return
      }
      if (nextView === 'teacher' && role !== ROLES.TEACHER) {
        setView('login')
        return
      }
      if (tab) setAdminTab(tab)
      setView(nextView)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [auth.user],
  )

  const handleLogin = async (email, password) => {
    const account = await auth.login(email, password)
    if (!account) return false
    setAdminTab(null)
    setView(account.role === ROLES.ADMIN ? 'admin' : 'teacher')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return true
  }

  const handleLogout = () => {
    auth.logout()
    setAdminTab(null)
    setView('landing')
  }

  const renderView = () => {
    if (auth.isRestoring) {
      return <p className="px-4 py-16 text-center text-sm text-slate-500">Verificando la sesión…</p>
    }
    if (view === 'login') return <LoginPage onLogin={handleLogin} error={auth.error} onNavigate={navigate} />
    if (view === 'admin' && auth.user?.role === ROLES.ADMIN) {
      return (
        <AdminDashboard
          key={adminTab ?? 'default'}
          store={store}
          currentUser={auth.user}
          initialTab={adminTab}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
        />
      )
    }
    if (view === 'teacher' && auth.user?.role === ROLES.TEACHER) {
      return (
        <TeacherDashboard
          store={store}
          currentUser={auth.user}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
        />
      )
    }
    return <LandingPage onNavigate={navigate} />
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <TopNavbar user={auth.user} breadcrumb={breadcrumb} onNavigate={navigate} onLogout={handleLogout} />
      <div className="flex-1">{renderView()}</div>
      <footer className="border-t border-slate-300 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-[11px] text-slate-500 sm:px-6 lg:px-8">
          <p>Prototipo académico · estimaciones pedagógicas, no calificaciones.</p>
          <p className="font-mono">React · Tailwind CSS · autenticación con API REST · resto de datos simulados</p>
        </div>
      </footer>
    </div>
  )
}
