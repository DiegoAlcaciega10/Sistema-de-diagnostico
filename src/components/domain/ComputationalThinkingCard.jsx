import HexagonalNodesChart from '../charts/HexagonalNodesChart'
import GhBox from '../ui/GhBox'
import MethodologicalBanner from '../ui/MethodologicalBanner'
import StatusBadge from '../ui/StatusBadge'

export default function ComputationalThinkingCard({ data }) {
  return (
    <GhBox
      title="Estimación Interpretativa de Pensamiento Computacional"
      subtitle="Observaciones aproximadas derivadas de evidencias estructurales del archivo .py."
      actions={
        <span className="rounded-md border border-slate-300 bg-white px-2 py-1 font-mono text-[10px] text-slate-500">
          Prompt {data.promptVersion}
        </span>
      }
      bodyClassName="p-4"
    >
      <MethodologicalBanner tone="interpretation" title="No es una medición psicométrica ni una calificación">
        Esta estimación es interpretativa y aproximada. Se sustenta únicamente en indicios estructurales del archivo
        entregado; no mide directamente la capacidad cognitiva del estudiante ni sustituye la valoración pedagógica.
      </MethodologicalBanner>

      <div className="mt-4 rounded-md border border-slate-300 bg-slate-50 p-3">
        <HexagonalNodesChart dimensions={data.dimensions} />
      </div>

      <dl className="mt-4 space-y-2">
        {data.dimensions.map((dimension) => (
          <div key={dimension.name} className="rounded-md border border-slate-300 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <dt className="text-xs font-semibold text-slate-900">{dimension.name}</dt>
              <StatusBadge level={dimension.level} />
            </div>
            <dd className="mt-1.5 text-xs leading-relaxed text-slate-600">{dimension.evidence}</dd>
            <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">{dimension.reference}</p>
          </div>
        ))}
      </dl>

      <blockquote className="mt-4 border-l-2 border-brand/40 pl-3 text-[11px] italic leading-relaxed text-slate-500">
        {data.citation}
      </blockquote>
    </GhBox>
  )
}
