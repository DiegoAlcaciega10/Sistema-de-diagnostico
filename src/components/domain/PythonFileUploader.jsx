import { useRef, useState } from 'react'
import { PIPELINE_STEPS } from '../../data/mockData'
import { useAnalysisPipeline } from '../../hooks/useAnalysisPipeline'
import { usePythonFileValidator } from '../../hooks/usePythonFileValidator'
import ChevronPipeline from '../charts/ChevronPipeline'
import Button from '../ui/Button'
import GhBox from '../ui/GhBox'
import Icon from '../ui/Icon'
import MethodologicalBanner from '../ui/MethodologicalBanner'

const formatSize = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

export default function PythonFileUploader({ group, onComplete }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const validator = usePythonFileValidator()
  const pipeline = useAnalysisPipeline(PIPELINE_STEPS)

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    validator.addFiles(event.dataTransfer.files)
  }

  const handleAnalyze = () => {
    if (!validator.isReady || pipeline.isRunning) return
    const entries = validator.entries.map((entry) => ({
      studentName: entry.studentName,
      fileName: entry.file.name,
    }))
    pipeline.start(() => {
      onComplete(entries)
      validator.reset()
    })
  }

  return (
    <GhBox
      title="Carga de trabajos .py"
      subtitle={`Grupo NRC ${group.nrc} · ${group.subject}`}
      actions={
        <span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 font-mono text-[10px] text-slate-500">
          {validator.entries.length} archivo(s)
        </span>
      }
      bodyClassName="p-4"
    >
      <MethodologicalBanner tone="readonly" title="Alcance de la carga">
        Se aceptan exclusivamente archivos <code className="font-mono">.py</code>. No se admiten ZIP, carpetas ni enlaces
        de GitHub; el análisis usa solo los archivos seleccionados en esta sesión.
      </MethodologicalBanner>

      <div
        onDragEnter={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`mt-4 rounded-md border-2 border-dashed px-5 py-7 text-center transition-colors ${
          dragging ? 'border-brand bg-indigo-50' : 'border-slate-300 bg-slate-50'
        }`}
      >
        <Icon name="upload" className="mx-auto h-7 w-7 text-brand" />
        <p className="mt-2 text-sm font-semibold text-slate-900">Arrastre aquí los entregables</p>
        <p className="mt-1 text-xs text-slate-500">Carga múltiple · extensión .py · sin archivos ZIP ni enlaces externos</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".py"
          aria-label="Seleccionar archivos Python .py"
          className="hidden"
          onChange={(event) => {
            validator.addFiles(event.target.files)
            event.target.value = ''
          }}
        />
        <Button variant="secondary" size="sm" icon="file" className="mt-4" onClick={() => inputRef.current?.click()}>
          Seleccionar archivos .py
        </Button>
      </div>

      {validator.errors.length > 0 ? (
        <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3" role="alert">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-xs font-semibold text-rose-800">
              <Icon name="circleAlert" className="h-4 w-4" />
              Archivos rechazados
            </p>
            <button
              type="button"
              onClick={validator.clearErrors}
              className="text-[11px] font-semibold text-rose-800 underline underline-offset-2"
            >
              Limpiar avisos
            </button>
          </div>
          <ul className="mt-2 space-y-1 text-[11px] text-rose-800">
            {validator.errors.map((error) => (
              <li key={error}>· {error}</li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] text-rose-700">
            Extensiones rechazadas con frecuencia: <code className="font-mono">.cs</code>,{' '}
            <code className="font-mono">.java</code>, <code className="font-mono">.zip</code>.
          </p>
        </div>
      ) : null}

      {validator.entries.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {validator.entries.map((entry) => (
            <li key={entry.id} className="flex flex-wrap items-center gap-3 rounded-md border border-slate-300 p-3">
              <Icon name="file" className="h-4 w-4 shrink-0 text-brand" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[11px] text-slate-900">{entry.file.name}</p>
                <p className="text-[10px] text-slate-500">{formatSize(entry.file.size)}</p>
              </div>
              <label className="flex items-center gap-2 text-[11px] text-slate-500">
                Estudiante
                <input
                  type="text"
                  value={entry.studentName}
                  onChange={(event) => validator.updateStudentName(entry.id, event.target.value)}
                  placeholder="Nombre completo"
                  aria-label={`Nombre del estudiante para ${entry.file.name}`}
                  className="w-44 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-brand focus:outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => validator.removeEntry(entry.id)}
                aria-label={`Quitar ${entry.file.name}`}
                className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 border-t border-slate-300 pt-4">
        <ChevronPipeline
          steps={PIPELINE_STEPS}
          activeIndex={pipeline.activeIndex}
          completed={pipeline.completed}
          title="Progreso del análisis"
        />
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <progress
            className="progress-editorial min-w-48 flex-1"
            value={pipeline.progress}
            max="100"
            aria-label="Progreso del análisis de entregables"
          />
          <span className="font-mono text-xs text-brand">{pipeline.progress}%</span>
          <Button icon="sparkles" onClick={handleAnalyze} disabled={!validator.isReady || pipeline.isRunning}>
            {pipeline.isRunning ? 'Analizando…' : 'Analizar entregables'}
          </Button>
        </div>
        {!validator.isReady && validator.entries.length > 0 ? (
          <p className="mt-2 text-[11px] text-slate-500">Asigne el nombre del estudiante a cada archivo para continuar.</p>
        ) : null}
      </div>
    </GhBox>
  )
}
