const levelColors = {
  Deficiente: '#e11d48',
  'En desarrollo': '#d97706',
  Satisfactorio: '#059669',
}

export default function ConcentricArcsChart({ pillars = [], title = 'Dominio por pilar' }) {
  const center = 110
  const average = pillars.length
    ? pillars.reduce((sum, pillar) => sum + (pillar.score ?? 0), 0) / pillars.length
    : 0
  const summary = pillars
    .map((pillar) => `${pillar.name}: ${Math.round((pillar.score ?? 0) * 100)} %`)
    .join(', ')

  return (
    <figure>
      {title ? <figcaption className="text-sm font-semibold text-slate-900">{title}</figcaption> : null}
      <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <svg viewBox="0 0 220 220" className="h-52 w-52 shrink-0" role="img" aria-label={`Dominio por pilar. ${summary}`}>
          <title>{title}</title>
          <desc>{summary}</desc>
          {pillars.map((pillar, index) => {
            const radius = 92 - index * 18
            const circumference = 2 * Math.PI * radius
            const progress = Math.max(0, Math.min(1, pillar.score ?? 0))
            return (
              <g key={pillar.id}>
                <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={levelColors[pillar.level] ?? '#4f46e5'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference * progress} ${circumference}`}
                  transform={`rotate(-90 ${center} ${center})`}
                />
              </g>
            )
          })}
          <text x={center} y={center - 2} textAnchor="middle" fontSize="26" fontWeight="700" fill="#0f172a">
            {Math.round(average * 100)}%
          </text>
          <text x={center} y={center + 16} textAnchor="middle" fontSize="10" fill="#64748b">
            promedio
          </text>
        </svg>

        <ul className="w-full flex-1 space-y-2">
          {pillars.map((pillar) => (
            <li key={pillar.id} className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
              <span className="flex items-center gap-2 text-xs text-slate-600">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: levelColors[pillar.level] ?? '#4f46e5' }}
                  aria-hidden="true"
                />
                {pillar.name}
              </span>
              <span className="font-mono text-xs font-semibold text-brand">
                {Math.round((pillar.score ?? 0) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
