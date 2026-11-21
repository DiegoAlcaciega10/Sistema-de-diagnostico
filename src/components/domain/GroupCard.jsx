import Button from '../ui/Button'
import Icon from '../ui/Icon'

export default function GroupCard({
  group,
  studentCount,
  teacherName,
  editable = false,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className={`rounded-md border bg-white p-4 transition-colors ${
        selected ? 'border-brand ring-1 ring-brand/30' : 'border-slate-300 hover:border-slate-400'
      }`}
      aria-current={selected ? 'true' : undefined}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon name="folder" className="h-4 w-4 text-brand" />
            <code className="font-mono text-xs font-semibold text-brand">NRC {group.nrc}</code>
          </div>
          <h3 className="mt-1.5 truncate text-sm font-semibold text-slate-900" title={group.subject}>
            {group.subject}
          </h3>
        </div>
        <span className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-500">
          {group.period}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3 text-xs">
        <div>
          <dt className="text-slate-500">Estudiantes</dt>
          <dd className="mt-0.5 font-mono font-semibold text-slate-900">{studentCount}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-slate-500">Docente</dt>
          <dd className="mt-0.5 truncate font-semibold text-slate-900" title={teacherName}>
            {teacherName}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button variant={selected ? 'primary' : 'secondary'} size="sm" onClick={() => onSelect?.(group.id)}>
          {selected ? 'Grupo activo' : 'Abrir grupo'}
        </Button>
        {editable ? (
          <>
            <Button variant="ghost" size="sm" icon="edit" onClick={() => onEdit?.(group)}>
              Editar
            </Button>
            <Button variant="ghost" size="sm" icon="trash" onClick={() => onDelete?.(group)}>
              Eliminar
            </Button>
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <Icon name="eye" className="h-3.5 w-3.5" />
            Solo lectura
          </span>
        )}
      </div>
    </div>
  )
}
