export default function ChevronPipeline({
  steps = [],
  activeIndex = -1,
  completed = [],
  title = 'Pipeline de análisis',
  compact = false,
}) {
  const stepWidth = 164
  const height = 56
  const arrow = 16
  const width = steps.length * stepWidth + arrow
  const summary = steps.map((step, index) => `${index + 1}. ${step.label}`).join(' → ')

  return (
    <figure>
      {title ? <figcaption className="sr-only">{title}</figcaption> : null}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={compact ? 'h-12 w-full' : 'h-16 w-full'}
        preserveAspectRatio="xMinYMid meet"
        role="img"
        aria-label={summary}
      >
        <title>{title}</title>
        <desc>{summary}</desc>
        {steps.map((step, index) => {
          const x = index * stepWidth
          const done = completed.includes(step.id)
          const active = activeIndex === index
          const fill = done ? '#4f46e5' : active ? '#e0e7ff' : '#ffffff'
          const stroke = done ? '#4338ca' : active ? '#4f46e5' : '#cbd5e1'
          const textFill = done ? '#ffffff' : '#312e81'
          const path = `M ${x} 4 H ${x + stepWidth - arrow} L ${x + stepWidth} ${height / 2} L ${
            x + stepWidth - arrow
          } ${height - 4} H ${x} L ${x + arrow} ${height / 2} Z`

          return (
            <g key={step.id}>
              <path d={path} fill={fill} stroke={stroke} strokeWidth="1.5" />
              <text x={x + arrow + 8} y="25" fontSize="11" fontWeight="700" fill={textFill}>
                {`${index + 1}. ${step.shortLabel ?? step.label}`}
              </text>
              {!compact && step.detail ? (
                <text x={x + arrow + 8} y="40" fontSize="9" fill={done ? '#e0e7ff' : '#64748b'}>
                  {step.detail.length > 24 ? `${step.detail.slice(0, 23)}…` : step.detail}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
