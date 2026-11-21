import CodeLineViewer from '../ui/CodeLineViewer'
import GhBox from '../ui/GhBox'
import StatusBadge from '../ui/StatusBadge'

const sonarTones = {
  ok: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-rose-500',
}

export default function PillarCard({ pillar, fileName }) {
  const percentage = Math.round((pillar.score ?? 0) * 100)

  return (
    <GhBox
      title={pillar.name}
      subtitle={pillar.description}
      actions={<StatusBadge level={pillar.level} />}
      bodyClassName="p-4"
    >
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">Nivel estimado de dominio</span>
          <span className="font-mono font-semibold text-brand">{percentage}%</span>
        </div>
        <progress
          className="progress-editorial mt-2"
          value={percentage}
          max="100"
          aria-label={`Estimación de dominio en ${pillar.name}`}
        />
        <p className="mt-1.5 text-[11px] text-slate-500">
          Umbral de referencia:{' '}
          <span className="font-mono font-semibold text-slate-800">{pillar.threshold.toFixed(2)}</span>
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Métricas C&amp;K</p>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {pillar.ckMetrics.map((metric) => (
            <div key={metric.id} className="rounded-md border border-slate-300 bg-slate-50 px-2.5 py-2">
              <dt className="font-mono text-[10px] font-semibold text-brand">{metric.label}</dt>
              <dd className={`mt-0.5 text-[11px] ${metric.estimable ? 'text-slate-900' : 'italic text-slate-500'}`}>
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Indicadores SonarQube</p>
        <div className="flex flex-wrap gap-2">
          {pillar.sonarIndicators.map((indicator) => (
            <span
              key={indicator.name}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] text-slate-600"
            >
              <span className={`h-2 w-2 rounded-full ${sonarTones[indicator.tone]}`} aria-hidden="true" />
              {indicator.name}: <strong className="font-semibold text-slate-900">{indicator.value}</strong>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <CodeLineViewer
          fileName={fileName}
          code={pillar.evidence.code}
          astNodes={pillar.evidence.astNodes}
          highlightLines={pillar.evidence.highlightLines}
        />
      </div>
    </GhBox>
  )
}
