import GhBox from '../ui/GhBox'
import Icon from '../ui/Icon'
import MethodologicalBanner from '../ui/MethodologicalBanner'

export default function PromptsPanel({ prompts }) {
  return (
    <div className="space-y-4">
      <MethodologicalBanner tone="readonly" title="Prompts de IA en modo de solo lectura">
        Se muestran versión y fecha de cada plantilla. La edición de prompts está fuera del alcance de este prototipo.
      </MethodologicalBanner>

      <div className="grid gap-3 xl:grid-cols-2">
        {prompts.map((prompt) => (
          <GhBox
            key={prompt.id}
            title={prompt.name}
            actions={
              <span className="rounded-md border border-slate-300 bg-white px-2 py-1 font-mono text-[10px] text-slate-500">
                {prompt.version} · {prompt.updatedAt}
              </span>
            }
            bodyClassName="p-4"
          >
            <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <Icon name="robot" className="h-3.5 w-3.5 text-brand" />
              Plantilla consultable
            </p>
            <pre className="overflow-x-auto rounded-md border border-slate-300 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-700">
              <code>{prompt.content}</code>
            </pre>
          </GhBox>
        ))}
      </div>
    </div>
  )
}
