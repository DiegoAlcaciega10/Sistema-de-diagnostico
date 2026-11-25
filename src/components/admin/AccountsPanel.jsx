import { useState } from 'react'
import { ROLES } from '../../data/mockData'
import Button from '../ui/Button'
import GhBox from '../ui/GhBox'
import StatusBadge from '../ui/StatusBadge'
import AccountDialogs from './AccountDialogs'

const MIN_PASSWORD_LENGTH = 10

const emptyForm = { name: '', email: '', password: '', role: ROLES.TEACHER, active: true }
const noticeStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
}

// Las acciones onAdd, onUpdate, onToggle y onDelete llaman al backend y devuelven { ok, message }.
export default function AccountsPanel({
  users,
  status,
  loadError,
  onReload,
  currentUser,
  onAdd,
  onUpdate,
  onToggle,
  onDelete,
}) {
  const [dialog, setDialog] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [notice, setNotice] = useState(null)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setDialog('form')
  }

  // La contraseña no se muestra ni se recupera: el campo vacío conserva la actual.
  const openEdit = (user) => {
    setEditing(user)
    setForm({ name: user.name, email: user.email, password: '', role: user.role, active: user.active })
    setError('')
    setDialog('form')
  }

  const openDelete = (user) => {
    setEditing(user)
    setError('')
    setDialog('delete')
  }

  const validate = () => {
    if (!form.name.trim() || !form.email.trim()) return 'Nombre y correo son obligatorios.'
    if (!editing && !form.password) return 'La contraseña es obligatoria.'
    if (form.password && form.password.length < MIN_PASSWORD_LENGTH) {
      return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
    }
    return ''
  }

  const handleSave = async () => {
    const problem = validate()
    if (problem) {
      setError(problem)
      return
    }
    setSaving(true)
    setError('')
    const result = editing ? await onUpdate(editing.id, form) : await onAdd(form)
    setSaving(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setDialog(null)
    setNotice({ tone: 'success', text: editing ? 'Cuenta actualizada.' : 'Cuenta creada.' })
  }

  const handleToggle = async (user) => {
    if (user.id === currentUser.id) return
    setBusyId(user.id)
    setNotice(null)
    const result = await onToggle(user.id, !user.active)
    setBusyId(null)
    setNotice(
      result.ok
        ? { tone: 'success', text: user.active ? 'Cuenta desactivada.' : 'Cuenta activada.' }
        : { tone: 'error', text: result.message },
    )
  }

  const handleDelete = async () => {
    if (!editing || editing.id === currentUser.id) return
    setSaving(true)
    setError('')
    const result = await onDelete(editing.id)
    setSaving(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setDialog(null)
    setNotice({ tone: 'success', text: 'Cuenta eliminada.' })
  }

  const closeDialog = () => {
    if (!saving) setDialog(null)
  }

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const renderRows = () => {
    if (status === 'loading') {
      return (
        <tr>
          <td colSpan={5} className="text-center text-sm text-slate-500">
            Cargando cuentas…
          </td>
        </tr>
      )
    }
    if (status === 'error') {
      return (
        <tr>
          <td colSpan={5} className="text-center text-sm text-rose-700">
            {loadError}{' '}
            <Button variant="ghost" size="sm" icon="activity" onClick={onReload}>
              Reintentar
            </Button>
          </td>
        </tr>
      )
    }
    if (users.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="text-center text-sm text-slate-500">
            No hay cuentas registradas.
          </td>
        </tr>
      )
    }
    return users.map((user) => {
      const isSelf = user.id === currentUser.id
      const isBusy = busyId === user.id
      return (
        <tr key={user.id}>
          <th scope="row">
            <span className="text-slate-900">{user.name}</span>
            {isSelf ? <span className="ml-2 font-mono text-[10px] text-brand">(usted)</span> : null}
          </th>
          <td data-label="Correo" className="font-mono text-[11px]">
            {user.email}
          </td>
          <td data-label="Rol">{user.role === ROLES.ADMIN ? 'Administrador' : 'Docente'}</td>
          <td data-label="Estado">
            <StatusBadge status={user.active ? 'Activa' : 'Inactiva'} />
          </td>
          <td data-label="Acciones">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" icon="edit" disabled={isBusy} onClick={() => openEdit(user)}>
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon="eye"
                disabled={isSelf || isBusy}
                onClick={() => handleToggle(user)}
              >
                {isBusy ? 'Guardando…' : user.active ? 'Desactivar' : 'Activar'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon="trash"
                disabled={isSelf || isBusy}
                onClick={() => openDelete(user)}
              >
                Eliminar
              </Button>
            </div>
          </td>
        </tr>
      )
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {status === 'ready' ? (
            <>
              <span className="font-mono font-semibold text-slate-900">{users.length}</span> cuentas registradas.
            </>
          ) : (
            'Cuentas del sistema.'
          )}
        </p>
        <Button icon="plus" onClick={openCreate} disabled={status !== 'ready'}>
          Nueva cuenta
        </Button>
      </div>

      {notice ? (
        <p role="status" className={`rounded-md border p-3 text-xs ${noticeStyles[notice.tone]}`}>
          {notice.text}
        </p>
      ) : null}

      <GhBox
        title="Cuentas y roles"
        subtitle="La cuenta propia no puede desactivarse ni eliminarse. Las cuentas con información asociada se desactivan en lugar de eliminarse."
        bodyClassName="p-0"
      >
        <div className="diagnosis-table-wrapper" role="region" aria-label="Cuentas y roles" tabIndex={0}>
          <table className="diagnosis-table" aria-busy={status === 'loading'}>
            <caption className="sr-only">Gestión de cuentas y roles institucionales</caption>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>{renderRows()}</tbody>
          </table>
        </div>
      </GhBox>

      <AccountDialogs
        dialog={dialog}
        editing={editing}
        editingSelf={editing?.id === currentUser.id}
        form={form}
        error={error}
        saving={saving}
        minPasswordLength={MIN_PASSWORD_LENGTH}
        onFieldChange={updateField}
        onClose={closeDialog}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
