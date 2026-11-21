import GhBox from '../ui/GhBox'
import Icon from '../ui/Icon'
import MethodologicalBanner from '../ui/MethodologicalBanner'

export default function AiSuggestionsCard({ suggestions }) {
  return (
    <GhBox
      title="Sugerencias Pedagógicas Orientativas (Opcionales)"
      subtitle="Apoyo didáctico opcional, vinculado a evidencias AST del archivo entregado."
      actions={
        <span className="rounded-md border border-slate-300 bg-white px-2 py-1 font-mono text-[10px] text-slate-500">
          Prompt {suggestions.promptVersion}
        </span>
      }
      bodyClassName="p-4"
    >
      <MethodologicalBanner tone="optional" title="Aplicación a criterio docente">
        Estas recomendaciones son generadas como apoyo didáctico opcional para orientar el refuerzo en clase; su
        aplicación queda a criterio del docente y no constituyen requisitos obligatorios ni rúbricas de evaluación.
      </MethodologicalBanner>

      <ol className="mt-4 space-y-2">
        {suggestions.items.map((item, index) => (
          <li key={item.id} className="rounded-md border border-slate-300 bg-white p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                {index + 1}
              </span>
              <span className="rounded-full border border-brand/20 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-brand">
                {item.pillar}
              </span>
              <h4 className="text-xs font-semibold text-slate-900">{item.title}</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.detail}</p>
            <p className="mt-2 font-mono text-[10px] text-brand">Evidencia: {item.evidenceRef}</p>
          </li>
        ))}
      </ol>

      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-500">
        <Icon name="lock" className="h-3.5 w-3.5" />
        Contenido de solo lectura. No editable desde esta interfaz.
      </p>
    </GhBox>
  )
}
