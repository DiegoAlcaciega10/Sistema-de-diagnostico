import { useState } from 'react'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

const emptyForm = { nrc: '', subject: '', period: '2026-A' }
const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none'

export default function GroupEditor({ dialog, group, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(() =>
    group ? { nrc: group.nrc, subject: group.subject, period: group.period } : emptyForm,
  )
  const [error, setError] = useState('')

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const handleSave = () => {
    if (!form.nrc.trim() || !form.subject.trim()) {
      setError('El NRC y la asignatura son obligatorios.')
      return
    }
    onSave(form)
  }

  return (
    <>
      <Modal
        isOpen={dialog === 'form'}
        onClose={onClose}
        title={group ? 'Editar grupo NRC' : 'Nuevo grupo NRC'}
        description="Los grupos se registran únicamente en la memoria del prototipo."
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar grupo</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-500">
            Código NRC
            <input
              autoFocus
              className={`${inputClass} mt-1.5`}
              value={form.nrc}
              onChange={(event) => updateField('nrc', event.target.value)}
              placeholder="4521"
            />
          </label>
          <label className="text-xs font-semibold text-slate-500">
            Período
            <select
              className={`${inputClass} mt-1.5`}
              value={form.period}
              onChange={(event) => updateField('period', event.target.value)}
            >
              <option value="2026-A">2026-A</option>
              <option value="2026-B">2026-B</option>
            </select>
          </label>
        </div>
        <label className="mt-4 block text-xs font-semibold text-slate-500">
          Asignatura
          <input
            className={`${inputClass} mt-1.5`}
            value={form.subject}
            onChange={(event) => updateField('subject', event.target.value)}
            placeholder="Programación Orientada a Objetos"
          />
        </label>
        {error ? (
          <p role="alert" className="mt-3 text-xs text-rose-700">
            {error}
          </p>
        ) : null}
      </Modal>

      <Modal
        isOpen={dialog === 'delete'}
        onClose={onClose}
        title="Confirmar eliminación del grupo"
        description="Se eliminarán también sus estudiantes y diagnósticos asociados en esta sesión."
        footer={
          <>
            <Button variant="secondary" autoFocus onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={onDelete}>
              Eliminar grupo
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          ¿Eliminar el NRC <strong className="text-slate-900">{group?.nrc}</strong> · {group?.subject}?
        </p>
      </Modal>
    </>
  )
}
