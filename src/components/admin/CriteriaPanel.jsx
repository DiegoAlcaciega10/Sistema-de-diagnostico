import GhBox from '../ui/GhBox'
import MethodologicalBanner from '../ui/MethodologicalBanner'

export default function CriteriaPanel({ criteria }) {
  return (
    <div className="space-y-4">
      <MethodologicalBanner tone="readonly" title="Criterios y umbrales de referencia">
        Configuración institucional de solo lectura. No es posible editar reglas, umbrales ni fundamentos científicos
        desde esta interfaz.
      </MethodologicalBanner>

      <div className="grid gap-3 lg:grid-cols-2">
        {criteria.map((criterion) => (
          <GhBox
            key={criterion.id}
            title={criterion.pillar}
            subtitle={criterion.rule}
            actions={
              <span className="rounded-md border border-brand/20 bg-indigo-50 px-2 py-1 font-mono text-xs font-semibold text-brand">
                ≥ {criterion.threshold.toFixed(2)}
              </span>
            }
            bodyClassName="p-4"
          >
            <dl className="space-y-2 border-t border-slate-200 pt-3 text-xs">
              <div className="flex flex-wrap gap-2">
                <dt className="font-semibold text-slate-500">Referencia:</dt>
                <dd className="flex-1 text-slate-800">{criterion.reference}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-slate-500">Versión:</dt>
                <dd className="font-mono text-slate-800">{criterion.version}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-slate-500">Actualizado:</dt>
                <dd className="font-mono text-slate-800">{criterion.updatedAt}</dd>
              </div>
            </dl>
          </GhBox>
        ))}
      </div>
    </div>
  )
}
