import { ROLES } from '../../data/mockData'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Modal from '../ui/Modal'

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none disabled:bg-slate-100 disabled:text-slate-500'

function ErrorMessage({ error }) {
  if (!error) return null
  return (
    <p role="alert" className="mt-3 flex items-center gap-2 text-xs text-rose-700">
      <Icon name="alert" className="h-4 w-4" /> {error}
    </p>
  )
}

export default function AccountDialogs({
  dialog,
  editing,
  editingSelf,
  form,
  error,
  saving,
  minPasswordLength,
  onFieldChange,
  onClose,
  onSave,
  onDelete,
}) {
  const submit = (event) => {
    event.preventDefault()
    onSave()
  }

  return (
    <>
      <Modal
        isOpen={dialog === 'form'}
        onClose={onClose}
        title={editing ? 'Editar cuenta' : 'Crear cuenta'}
        description={
          editing
            ? 'Los cambios se guardan en el sistema. Deje la contraseña vacía para conservar la actual.'
            : 'La cuenta podrá ingresar con el correo y la contraseña indicados.'
        }
        footer={
          <>
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="account-form" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
          </>
        }
      >
        <form id="account-form" onSubmit={submit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-500">
              Nombre completo
              <input
                autoFocus
                maxLength={120}
                className={`${inputClass} mt-1.5`}
                value={form.name}
                onChange={(event) => onFieldChange('name', event.target.value)}
              />
            </label>
            <label className="text-xs font-semibold text-slate-500">
              Correo electrónico
              <input
                type="email"
                maxLength={254}
                autoComplete="off"
                className={`${inputClass} mt-1.5`}
                value={form.email}
                onChange={(event) => onFieldChange('email', event.target.value)}
              />
            </label>
            <label className="text-xs font-semibold text-slate-500">
              {editing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              <input
                type="password"
                autoComplete="new-password"
                maxLength={200}
                placeholder={editing ? 'Sin cambios' : `Mínimo ${minPasswordLength} caracteres`}
                className={`${inputClass} mt-1.5`}
                value={form.password}
                onChange={(event) => onFieldChange('password', event.target.value)}
              />
            </label>
            <label className="text-xs font-semibold text-slate-500">
              Rol
              <select
                className={`${inputClass} mt-1.5`}
                value={form.role}
                disabled={editingSelf}
                onChange={(event) => onFieldChange('role', event.target.value)}
              >
                <option value={ROLES.TEACHER}>Docente</option>
                <option value={ROLES.ADMIN}>Administrador</option>
              </select>
            </label>
          </div>
          <label className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
            <input
              type="checkbox"
              checked={form.active}
              disabled={editingSelf}
              onChange={(event) => onFieldChange('active', event.target.checked)}
            />
            Cuenta activa
          </label>
          {editingSelf ? (
            <p className="mt-2 text-[11px] text-slate-500">
              No puede cambiar el rol ni desactivar su propia cuenta.
            </p>
          ) : null}
          <ErrorMessage error={error} />
        </form>
      </Modal>

      <Modal
        isOpen={dialog === 'delete'}
        onClose={onClose}
        title="Confirmar eliminación"
        description="La cuenta se eliminará del sistema y no podrá volver a ingresar."
        footer={
          <>
            <Button variant="secondary" autoFocus onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={onDelete} disabled={saving}>
              {saving ? 'Eliminando…' : 'Eliminar cuenta'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          ¿Desea eliminar la cuenta de <strong className="text-slate-900">{editing?.name}</strong>? Esta acción no se
          puede deshacer. Si la cuenta tiene información asociada, el sistema no la eliminará: desactívela en su lugar.
        </p>
        <ErrorMessage error={error} />
      </Modal>
    </>
  )
}
