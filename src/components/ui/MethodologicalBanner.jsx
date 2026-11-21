import Icon from './Icon'

const tones = {
  institutional: {
    wrapper: 'border-indigo-200 bg-indigo-50/60',
    accent: 'border-indigo-500 text-indigo-700',
    icon: 'shield',
  },
  estimation: {
    wrapper: 'border-amber-200 bg-amber-50',
    accent: 'border-amber-500 text-amber-800',
    icon: 'info',
  },
  interpretation: {
    wrapper: 'border-sky-200 bg-sky-50',
    accent: 'border-sky-500 text-sky-800',
    icon: 'brain',
  },
  readonly: {
    wrapper: 'border-slate-300 bg-slate-50',
    accent: 'border-slate-400 text-slate-600',
    icon: 'eye',
  },
  optional: {
    wrapper: 'border-emerald-200 bg-emerald-50/70',
    accent: 'border-emerald-500 text-emerald-800',
    icon: 'sparkles',
  },
}

export default function MethodologicalBanner({ tone = 'institutional', title, children, className = '' }) {
  const config = tones[tone] ?? tones.institutional

  return (
    <section className={`flex gap-3 rounded-md border border-l-4 p-3.5 ${config.wrapper} ${config.accent} ${className}`}>
      <Icon name={config.icon} className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">{title}</p>
        {children ? <div className="mt-1">{children}</div> : null}
      </div>
    </section>
  )
}
