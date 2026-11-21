const levelColors = {
  Deficiente: '#e11d48',
  'En desarrollo': '#d97706',
  Satisfactorio: '#059669',
}

const hexPoints = (centerX, centerY, radius) =>
  Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 3) * index - Math.PI / 6
    return `${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`
  }).join(' ')

const shortLabels = {
  Descomposición: 'Descomp.',
  'Reconocimiento de patrones': 'Patrones',
  Abstracción: 'Abstrac.',
  'Diseño de algoritmos': 'Algoritmos',
}

export default function HexagonalNodesChart({ dimensions = [], title = 'Dimensiones del pensamiento computacional' }) {
  const summary = dimensions
    .map((dimension) => `${dimension.name}: ${dimension.level ?? 'sin estimación'}`)
    .join(', ')
  const positions = dimensions.map((_, index) => ({ x: 56 + index * 104, y: 88 }))

  return (
    <figure>
      {title ? <figcaption className="text-sm font-semibold text-slate-900">{title}</figcaption> : null}
      <svg
        viewBox="0 0 440 180"
        className="mt-3 h-44 w-full"
        role="img"
        aria-label={`Estimación interpretativa de pensamiento computacional. ${summary}`}
      >
        <title>{title}</title>
        <desc>{summary}</desc>
        {positions.slice(0, -1).map((position, index) => {
          const next = positions[index + 1]
          return (
            <line
              key={`link-${index}`}
              x1={position.x}
              y1={position.y}
              x2={next.x}
              y2={next.y}
              stroke="#c7d2fe"
              strokeWidth="2"
            />
          )
        })}
        {dimensions.map((dimension, index) => {
          const position = positions[index]
          const fill = levelColors[dimension.level] ?? '#e2e8f0'
          return (
            <g key={dimension.name}>
              <title>{`${dimension.name}: ${dimension.level ?? 'sin estimación'}. ${dimension.evidence ?? ''}`}</title>
              <polygon
                points={hexPoints(position.x, position.y, 38)}
                fill={fill}
                fillOpacity="0.13"
                stroke="#4f46e5"
                strokeWidth="2"
              />
              <circle cx={position.x} cy={position.y} r="5" fill={fill} />
              <text x={position.x} y={position.y - 16} textAnchor="middle" fontSize="10" fontWeight="600" fill="#0f172a">
                {shortLabels[dimension.name] ?? dimension.name.slice(0, 8)}
              </text>
              <text x={position.x} y={position.y + 24} textAnchor="middle" fontSize="9" fill="#64748b">
                {dimension.level ?? '—'}
              </text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
