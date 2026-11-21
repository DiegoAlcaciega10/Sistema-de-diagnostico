import { useState } from 'react'
import { ROLES } from '../../data/mockData'
import Button from '../ui/Button'
import GhBox from '../ui/GhBox'
import StatusBadge from '../ui/StatusBadge'
import AccountDialogs from './AccountDialogs'

const emptyForm = { name: '', email: '', password: '', role: ROLES.TEACHER, active: true }

export default function AccountsPanel({ users, currentUser, onAdd, onUpdate, onToggle, onDelete }) {
  const [dialog, setDialog] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setDialog('form')
  }

  const openEdit = (user) => {
    setEditing(user)
    setForm({ name: user.name, email: user.email, password: user.password, role: user.role, active: user.active })
    setError('')
    setDialog('form')
  }

  const openDelete = (user) => {
    setEditing(user)
    setDialog('delete')
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Nombre, correo y contraseña son obligatorios.')
      return
    }
    if (editing) onUpdate(editing.id, form)
    else onAdd(form)
    setDialog(null)
  }

  const handleToggle = (user) => {
    if (user.id === currentUser.id) return
    onToggle(user.id, !user.active)
  }

  const handleDelete = () => {
    if (editing && editing.id !== currentUser.id) onDelete(editing.id)
    setDialog(null)
  }

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          <span className="font-mono font-semibold text-slate-900">{users.length}</span> cuentas registradas en el
          prototipo.
        </p>
        <Button icon="plus" onClick={openCreate}>
          Nueva cuenta
        </Button>
      </div>

      <GhBox
        title="Cuentas y roles"
        subtitle="La cuenta propia no puede desactivarse ni eliminarse."
        bodyClassName="p-0"
      >
        <div className="diagnosis-table-wrapper" role="region" aria-label="Cuentas y roles" tabIndex={0}>
          <table className="diagnosis-table">
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
            <tbody>
              {users.map((user) => {
                const isSelf = user.id === currentUser.id
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
                        <Button variant="ghost" size="sm" icon="edit" onClick={() => openEdit(user)}>
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" icon="eye" disabled={isSelf} onClick={() => handleToggle(user)}>
                          {user.active ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button variant="ghost" size="sm" icon="trash" disabled={isSelf} onClick={() => openDelete(user)}>
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </GhBox>

      <AccountDialogs
        dialog={dialog}
        editing={editing}
        form={form}
        error={error}
        onFieldChange={updateField}
        onClose={() => setDialog(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
