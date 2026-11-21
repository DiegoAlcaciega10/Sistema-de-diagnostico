import GhBox from '../ui/GhBox'
import Icon from '../ui/Icon'
import MethodologicalBanner from '../ui/MethodologicalBanner'
import StatusBadge from '../ui/StatusBadge'

const serviceIcons = {
  'API REST / AST': 'code',
  PostgreSQL: 'database',
  SonarQube: 'shield',
  'Servicio IA': 'robot',
}

export default function ServicesPanel({ services }) {
  return (
    <div className="space-y-4">
      <MethodologicalBanner tone="readonly" title="Monitoreo de servicios">
        Los estados son simulados en memoria. No se realizan comprobaciones de red ni se incrustan paneles externos.
      </MethodologicalBanner>

      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <GhBox key={service.id} bodyClassName="p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded bg-slate-100 text-brand">
                <Icon name={serviceIcons[service.name] ?? 'server'} className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-900">{service.name}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{service.detail}</p>
              </div>
              <StatusBadge status={service.status === 'online' ? 'En línea' : 'Fuera de línea'} />
            </div>
          </GhBox>
        ))}
      </div>

      <GhBox title="Panel externo de Grafana" subtitle="Enlace independiente, sin iframe incrustado" bodyClassName="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-xs leading-relaxed text-slate-500">
            Enlace independiente a la instancia institucional de monitorización. No se inserta dentro de la aplicación.
          </p>
          <a
            href="https://grafana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-brand/40 bg-white px-3 py-2 text-sm font-semibold text-brand hover:bg-indigo-50"
          >
            Abrir Grafana
            <Icon name="external" className="h-4 w-4" />
          </a>
        </div>
      </GhBox>
    </div>
  )
}
