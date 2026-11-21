import Icon from './Icon'

const evidencePattern = /(ABC|@abstractmethod|Protocol|__|class\s+\w+\([^)]*\)|self\._\w+|\bpass\b|isinstance|super\(\))/

const astTokens = (astNodes = []) =>
  astNodes
    .map((node) => node.split(':').slice(1).join(':').trim() || node)
    .filter((token) => token.length > 2)

export default function CodeLineViewer({
  title = 'Visor de código · GitHub blob',
  fileName,
  code = '',
  astNodes = [],
  highlightLines = [],
  lineTags = {},
}) {
  const lines = code.replace(/\n$/, '').split('\n')
  const explicit = new Set(highlightLines)
  const tokens = astTokens(astNodes)

  const isEvidenceLine = (line, index) =>
    explicit.has(index + 1) || evidencePattern.test(line) || tokens.some((token) => line.includes(token))

  return (
    <div className="overflow-hidden rounded-md border border-slate-700 bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 bg-slate-800 px-3 py-2">
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-100">
          <Icon name="file" className="h-3.5 w-3.5 text-indigo-300" />
          {title}
        </p>
        {fileName ? <code className="font-mono text-[11px] text-indigo-300">{fileName}</code> : null}
      </div>

      <div className="overflow-x-auto py-2">
        <table className="w-full border-collapse font-mono text-[11px] leading-relaxed">
          <caption className="sr-only">Evidencia de código Python con líneas detectadas por el análisis</caption>
          <tbody>
            {lines.map((line, index) => {
              const lineNumber = index + 1
              const highlighted = isEvidenceLine(line, index)
              return (
                <tr key={lineNumber} className={highlighted ? 'border-l-2 border-indigo-400 bg-indigo-500/20' : ''}>
                  <td className="w-12 select-none border-r border-slate-700 px-2 text-right align-top text-slate-500">
                    {lineNumber}
                  </td>
                  <td className={`whitespace-pre px-3 align-top ${highlighted ? 'text-white' : 'text-slate-300'}`}>
                    {line || ' '}
                  </td>
                  {lineTags[lineNumber] ? (
                    <td className="whitespace-nowrap px-2 align-top text-right text-[10px] text-indigo-300">
                      {lineTags[lineNumber]}
                    </td>
                  ) : (
                    <td />
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {astNodes.length > 0 ? (
        <div className="border-t border-slate-700 bg-slate-800 px-3 py-2">
          <p className="mb-1.5 font-sans text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Nodos AST detectados
          </p>
          <div className="flex flex-wrap gap-1.5">
            {astNodes.map((node) => (
              <span
                key={node}
                className="rounded-full border border-indigo-700/60 bg-indigo-950 px-2 py-0.5 font-mono text-[10px] text-indigo-300"
              >
                {node}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
