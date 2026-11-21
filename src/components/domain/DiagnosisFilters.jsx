import Icon from '../ui/Icon'

const fieldClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none'

export default function DiagnosisFilters({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="relative block">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Estudiante</span>
        <Icon name="search" className="pointer-events-none absolute left-2.5 top-[2.05rem] h-3.5 w-3.5 text-slate-400" />
        <input
          type="search"
          value={filters.name}
          onChange={(event) => update('name', event.target.value)}
          placeholder="Buscar por nombre"
          className={`${fieldClass} pl-8`}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Fecha de análisis</span>
        <input type="date" value={filters.date} onChange={(event) => update('date', event.target.value)} className={fieldClass} />
      </label>

      <label className="block">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Nivel global</span>
        <select value={filters.level} onChange={(event) => update('level', event.target.value)} className={fieldClass}>
          <option value="">Todos los niveles</option>
          <option value="Deficiente">Deficiente</option>
          <option value="En desarrollo">En desarrollo</option>
          <option value="Satisfactorio">Satisfactorio</option>
        </select>
      </label>
    </div>
  )
}
