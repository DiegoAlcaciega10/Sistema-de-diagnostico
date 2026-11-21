import { PILLARS, PIPELINE_STEPS } from '../data/mockData'
import ChevronPipeline from '../components/charts/ChevronPipeline'
import Button from '../components/ui/Button'
import GhBox from '../components/ui/GhBox'
import Icon from '../components/ui/Icon'

export default function LandingPage({ onNavigate }) {
  return (
    <main>
      <section className="border-b border-slate-300 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand">
              diagnóstico-formativo / python / poo
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Cuando el código se enreda,{' '}
              <span className="text-brand">se puede diagnosticar</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600">
              Una plataforma académica que transforma cada entrega <code className="font-mono text-brand">.py</code> en
              evidencia comprensible: identifica dificultades en los pilares de la POO y en el pensamiento
              computacional, sin convertir la estimación en una calificación.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Button icon="chevronRight" iconPosition="right" onClick={() => onNavigate('login')}>
                Acceder al sistema
              </Button>
              <Button variant="secondary" icon="file" onClick={() => onNavigate('login')}>
                Explorar la demo
              </Button>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Accesos de demostración: Administrador y Docente · Sin backend ni llamadas HTTP
            </p>
          </div>

          <GhBox
            title="Pipeline de análisis"
            subtitle="Etapas simuladas, trazables y de solo lectura"
            actions={
              <span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 font-mono text-[10px] text-slate-500">
                HU-10
              </span>
            }
            bodyClassName="p-4"
          >
            <ChevronPipeline steps={PIPELINE_STEPS} title="Pipeline de análisis" />
            <p className="mt-4 border-t border-slate-200 pt-3 text-[11px] leading-relaxed text-slate-500">
              Cada salida se presenta como estimación pedagógica contrastable con evidencias de código, nunca como
              sustituto del juicio docente.
            </p>
          </GhBox>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand">cuatro pilares / poo</p>
            <h2 className="mt-1.5 text-2xl font-semibold text-slate-900">Una mirada integral del aprendizaje</h2>
          </div>
          <p className="max-w-xl text-xs text-slate-500">
            Cada pilar se estima a partir de métricas C&amp;K, evidencias AST e indicadores de calidad, con umbrales de
            referencia consultables en modo solo lectura.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, index) => (
            <GhBox key={pillar.id} bodyClassName="p-4">
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-indigo-50 text-brand">
                  <Icon name={['layers', 'lock', 'branch', 'network'][index]} className="h-4 w-4" />
                </span>
                <span className="font-mono text-[10px] text-slate-400">0{index + 1}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{pillar.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{pillar.description}</p>
            </GhBox>
          ))}
        </div>
      </section>
    </main>
  )
}
