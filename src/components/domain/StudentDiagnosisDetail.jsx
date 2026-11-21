import AiSuggestionsCard from './AiSuggestionsCard'
import ComputationalThinkingCard from './ComputationalThinkingCard'
import PillarCard from './PillarCard'
import Button from '../ui/Button'
import MethodologicalBanner from '../ui/MethodologicalBanner'
import StatusBadge from '../ui/StatusBadge'

export default function StudentDiagnosisDetail({ student, group, diagnosis, readOnly = false, onBack }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-300 pb-4">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand">
            Diagnóstico individual · NRC {group.nrc}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">{student.name}</h2>
          <p className="mt-1 text-xs text-slate-500">
            Archivo <code className="font-mono text-brand">{diagnosis.fileName}</code> · Analizado el{' '}
            <span className="font-mono">{diagnosis.analyzedAt}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge level={diagnosis.overallLevel} />
          <Button variant="secondary" size="sm" icon="chevronLeft" onClick={onBack}>
            Volver al resumen
          </Button>
        </div>
      </div>

      <MethodologicalBanner tone="estimation" title="Nivel estimado de dominio conceptual, no nota académica">
        El diagnóstico de POO analiza exclusivamente el archivo <code className="font-mono">.py</code> entregado, sin
        dependencias externas. Las estimaciones apoyan la tutoría y no constituyen una calificación ni una decisión
        definitiva sobre el aprendizaje.
      </MethodologicalBanner>

      {readOnly ? (
        <MethodologicalBanner tone="readonly" title="Consulta administrativa en modo de solo lectura">
          La supervisión no permite alterar el diagnóstico, las evidencias ni las sugerencias generadas.
        </MethodologicalBanner>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {diagnosis.pillars.map((pillar) => (
          <PillarCard key={pillar.id} pillar={pillar} fileName={diagnosis.fileName} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AiSuggestionsCard suggestions={diagnosis.aiSuggestions} />
        <ComputationalThinkingCard data={diagnosis.computationalThinking} />
      </div>
    </div>
  )
}
