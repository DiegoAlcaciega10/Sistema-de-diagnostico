import { useId } from 'react'

const gridValues = [0, 25, 50, 75, 100]

export default function GridLineBarChart({ pillars = [], title = 'Desempeño estructural' }) {
  const glowId = useId().replace(/:/g, '')
  const base = 168
  const plotHeight = 140
  const barWidth = 46
  const barGap = 40
  const summary = pillars
    .map((pillar) => `${pillar.name}: ${Math.round((pillar.score ?? 0) * 100)} %`)
    .join(', ')

  const points = pillars
    .map((pillar, index) => {
      const x = 46 + index * (barWidth + barGap)
      const height = ((pillar.score ?? 0) * plotHeight)
      return `${x + barWidth / 2},${base - height}`
    })
    .join(' ')

  return (
    <figure>
      {title ? <figcaption className="text-sm font-semibold text-slate-900">{title}</figcaption> : null}
      <svg
        viewBox="0 0 420 200"
        className="mt-3 h-52 w-full"
        role="img"
        aria-label={`Desempeño estructural por pilar. ${summary}`}
      >
        <title>{title}</title>
        <desc>{summary}</desc>
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridValues.map((value) => {
          const y = base - (value / 100) * plotHeight
          return (
            <g key={value}>
              <line x1="36" y1={y} x2="410" y2={y} stroke="#e2e8f0" strokeDasharray={value === 0 ? '0' : '3 4'} />
              <text x="30" y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                {value}
              </text>
            </g>
          )
        })}

        {pillars.map((pillar, index) => {
          const x = 46 + index * (barWidth + barGap)
          const height = (pillar.score ?? 0) * plotHeight
          return (
            <g key={pillar.id}>
              <rect x={x} y={base - height} width={barWidth} height={height} rx="2" fill="#4f46e5" opacity="0.18" />
              <text x={x + barWidth / 2} y="190" textAnchor="middle" fontSize="10" fill="#475569">
                {(pillar.shortName ?? pillar.name).slice(0, 5)}
              </text>
            </g>
          )
        })}

        <polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="2.5" filter={`url(#${glowId})`} />
        {pillars.map((pillar, index) => {
          const x = 46 + index * (barWidth + barGap) + barWidth / 2
          const y = base - (pillar.score ?? 0) * plotHeight
          return <circle key={`${pillar.id}-node`} cx={x} cy={y} r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
        })}
      </svg>
    </figure>
  )
}
