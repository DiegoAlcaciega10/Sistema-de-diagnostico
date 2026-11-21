const levelColors = {
  Deficiente: '#e11d48',
  'En desarrollo': '#d97706',
  Satisfactorio: '#059669',
}

const legend = [
  { key: 'Deficiente', label: 'Deficiente' },
  { key: 'En desarrollo', label: 'En desarrollo' },
  { key: 'Satisfactorio', label: 'Satisfactorio' },
]

export default function SegmentedBlocksChart({ distributions = [], title = 'Distribución por pilar' }) {
  const blockCount = 8

  const blocksFor = (item) => {
    const total = item.total || 0
    if (total === 0) return Array.from({ length: blockCount }, () => 'Vacio')
    const deficient = Math.round(((item.counts?.Deficiente ?? 0) / total) * blockCount)
    const developing = Math.round(((item.counts?.['En desarrollo'] ?? 0) / total) * blockCount)
    return Array.from({ length: blockCount }, (_, index) => {
      if (index < deficient) return 'Deficiente'
      if (index < deficient + developing) return 'En desarrollo'
      if (index < blockCount) return 'Satisfactorio'
      return 'Vacio'
    })
  }

  const summary = distributions
    .map((item) => `${item.name}: ${item.counts?.Deficiente ?? 0} deficientes`)
    .join(', ')

  return (
    <figure>
      {title ? <figcaption className="text-sm font-semibold text-slate-900">{title}</figcaption> : null}
      <svg
        viewBox="0 0 360 210"
        className="mt-3 h-52 w-full"
        role="img"
        aria-label={`Distribución de estudiantes por pilar. ${summary}`}
      >
        <title>{title}</title>
        <desc>{summary}</desc>
        {distributions.map((item, index) => {
          const x = 20 + index * 86
          return (
            <g key={item.id}>
              {blocksFor(item).map((level, row) => {
                const y = 14 + row * 19
                return (
                  <rect
                    key={`${item.id}-${row}`}
                    x={x}
                    y={y}
                    width="52"
                    height="13"
                    rx="2"
                    fill={level === 'Vacio' ? '#f1f5f9' : levelColors[level]}
                    opacity={level === 'Vacio' ? 1 : 0.9}
                  />
                )
              })}
              <text x={x + 26} y="182" textAnchor="middle" fontSize="10" fill="#475569">
                {item.name.slice(0, 4)}
              </text>
              <text x={x + 26} y="197" textAnchor="middle" fontSize="9" fill="#94a3b8">
                n={item.total}
              </text>
            </g>
          )
        })}
      </svg>
      <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
        {legend.map((item) => (
          <li key={item.key} className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: levelColors[item.key] }} aria-hidden="true" />
            {item.label}
          </li>
        ))}
      </ul>
    </figure>
  )
}
