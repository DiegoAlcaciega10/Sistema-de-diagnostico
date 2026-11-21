const tones = {
  Deficiente: 'bg-rose-50 text-rose-700 border-rose-200',
  'En desarrollo': 'bg-amber-50 text-amber-700 border-amber-200',
  Satisfactorio: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'En línea': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Fuera de línea': 'bg-rose-50 text-rose-700 border-rose-200',
  Activa: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Inactiva: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function StatusBadge({ level, status, label, showDot = true, className = '' }) {
  const value = level ?? status
  const tone = tones[value] ?? 'bg-slate-100 text-slate-600 border-slate-300'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tone} ${className}`}
    >
      {showDot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {label ?? value}
    </span>
  )
}
