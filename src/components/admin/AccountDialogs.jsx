import { ROLES } from '../../data/mockData'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Modal from '../ui/Modal'

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none'

export default function AccountDialogs({ dialog, editing, form, error, onFieldChange, onClose, onSave, onDelete }) {
  return (
    <>
      <Modal
        isOpen={dialog === 'form'}
        onClose={onClose}
        title={editing ? 'Editar cuenta' : 'Crear cuenta'}
        description="Los cambios se aplican únicamente en la sesión local del prototipo."
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onSave}>Guardar</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-500">
            Nombre completo
            <input
              autoFocus
              className={`${inputClass} mt-1.5`}
              value={form.name}
              onChange={(event) => onFieldChange('name', event.target.value)}
            />
          </label>
          <label className="text-xs font-semibold text-slate-500">
            Correo electrónico
            <input
              type="email"
              className={`${inputClass} mt-1.5`}
              value={form.email}
              onChange={(event) => onFieldChange('email', event.target.value)}
            />
          </label>
          <label className="text-xs font-semibold text-slate-500">
            Contraseña
            <input
              type="text"
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
            onChange={(event) => onFieldChange('active', event.target.checked)}
          />
          Cuenta activa
        </label>
        {error ? (
          <p role="alert" className="mt-3 flex items-center gap-2 text-xs text-rose-700">
            <Icon name="alert" className="h-4 w-4" /> {error}
          </p>
        ) : null}
      </Modal>

      <Modal
        isOpen={dialog === 'delete'}
        onClose={onClose}
        title="Confirmar eliminación"
        description="La cuenta dejará de estar disponible en la lista de acceso."
        footer={
          <>
            <Button variant="secondary" autoFocus onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={onDelete}>
              Eliminar cuenta
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          ¿Desea eliminar la cuenta de <strong className="text-slate-900">{editing?.name}</strong>? Esta acción no se puede
          deshacer en el prototipo.
        </p>
      </Modal>
    </>
  )
}
