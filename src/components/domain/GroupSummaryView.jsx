import { useMemo, useState } from 'react'
import { PILLARS } from '../../data/mockData'
import ConcentricArcsChart from '../charts/ConcentricArcsChart'
import GridLineBarChart from '../charts/GridLineBarChart'
import SegmentedBlocksChart from '../charts/SegmentedBlocksChart'
import DiagnosisFilters from './DiagnosisFilters'
import Button from '../ui/Button'
import GhBox from '../ui/GhBox'
import MethodologicalBanner from '../ui/MethodologicalBanner'
import StatusBadge from '../ui/StatusBadge'

const emptyCounts = () => ({ Deficiente: 0, 'En desarrollo': 0, Satisfactorio: 0 })
const shortNames = {
  abstraction: 'Abs.',
  encapsulation: 'Enc.',
  inheritance: 'Her.',
  polymorphism: 'Pol.',
}

export default function GroupSummaryView({ group, students, diagnosesByStudent, readOnly = false, onOpenStudent }) {
  const [filters, setFilters] = useState({ name: '', date: '', level: '' })

  const rows = useMemo(
    () =>
      students
        .filter((student) => student.groupId === group.id)
        .map((student) => ({ student, diagnosis: diagnosesByStudent[student.id] }))
        .filter((row) => Boolean(row.diagnosis)),
    [students, diagnosesByStudent, group.id],
  )

  const distributions = useMemo(
    () =>
      PILLARS.map((pillar) => {
        const counts = emptyCounts()
        rows.forEach(({ diagnosis }) => {
          const found = diagnosis.pillars.find((item) => item.id === pillar.id)
          if (found) counts[found.level] += 1
        })
        return { id: pillar.id, name: pillar.name, counts, total: rows.length }
      }),
    [rows],
  )

  const pillarScores = useMemo(() => {
    const source = rows[0]?.diagnosis?.pillars ?? PILLARS.map((pillar) => ({ ...pillar, score: 0 }))
    return source.map((pillar) => ({ ...pillar, shortName: shortNames[pillar.id] ?? pillar.name }))
  }, [rows])

  const filteredRows = rows.filter(({ student, diagnosis }) => {
    const matchesName = student.name.toLowerCase().includes(filters.name.trim().toLowerCase())
    const matchesDate = !filters.date || diagnosis.analyzedAt === filters.date
    const matchesLevel = !filters.level || diagnosis.overallLevel === filters.level
    return matchesName && matchesDate && matchesLevel
  })

  return (
    <div className="space-y-4">
      {readOnly ? (
        <MethodologicalBanner tone="readonly" title="Supervisión global en modo de solo lectura">
          Este rol puede consultar los diagnósticos del NRC {group.nrc}, pero no modificar grupos, entregables ni reglas.
        </MethodologicalBanner>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-3">
        <GhBox
          title="Dominio por pilar"
          subtitle="Nivel estimado de cada estudiante"
          bodyClassName="p-4"
        >
          <ConcentricArcsChart title="" pillars={pillarScores} />
        </GhBox>
        <GhBox
          title="Distribución de niveles"
          subtitle="Bloques por pilar y semáforo de dominio"
          bodyClassName="p-4"
        >
          <SegmentedBlocksChart title="" distributions={distributions} />
        </GhBox>
        <GhBox
          title="Desempeño estructural"
          subtitle="Grilla cartesiana y puntos de referencia"
          bodyClassName="p-4"
        >
          <GridLineBarChart title="" pillars={pillarScores} />
        </GhBox>
      </div>

      <GhBox
        title="Estudiantes del grupo"
        subtitle="Seleccione un estudiante para consultar su diagnóstico individual."
        bodyClassName="p-0"
        footer={<p className="text-[11px] text-slate-500">{filteredRows.length} de {rows.length} diagnósticos visibles</p>}
      >
        <div className="border-b border-slate-300 bg-white p-4">
          <DiagnosisFilters filters={filters} onChange={setFilters} />
        </div>
        <div
          className="diagnosis-table-wrapper"
          role="region"
          aria-label={`Tabla de diagnósticos del grupo ${group.nrc}`}
          tabIndex={0}
        >
          <table className="diagnosis-table">
            <caption className="sr-only">Diagnósticos por estudiante y pilar de la POO</caption>
            <thead>
              <tr>
                <th scope="col">Estudiante</th>
                {PILLARS.map((pillar) => (
                  <th key={pillar.id} scope="col">
                    {pillar.name}
                  </th>
                ))}
                <th scope="col">Nivel global</th>
                <th scope="col">Fecha</th>
                <th scope="col">Inspección</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(({ student, diagnosis }) => (
                <tr key={student.id}>
                  <th scope="row">
                    <button
                      type="button"
                      onClick={() => onOpenStudent?.(student)}
                      className="text-left font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                    >
                      {student.name}
                    </button>
                  </th>
                  {PILLARS.map((pillar) => {
                    const value = diagnosis.pillars.find((item) => item.id === pillar.id)
                    return (
                      <td key={pillar.id} data-label={pillar.name}>
                        <StatusBadge level={value?.level} />
                      </td>
                    )
                  })}
                  <td data-label="Nivel global">
                    <StatusBadge level={diagnosis.overallLevel} />
                  </td>
                  <td data-label="Fecha" className="font-mono text-[11px] text-slate-500">
                    {diagnosis.analyzedAt}
                  </td>
                  <td data-label="Inspección">
                    <Button
                      variant="outline"
                      size="sm"
                      icon="eye"
                      onClick={() => onOpenStudent?.(student)}
                      aria-label={`Abrir diagnóstico de ${student.name}`}
                    >
                      Abrir diagnóstico
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRows.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-500">No hay diagnósticos que coincidan con los filtros.</p>
          ) : null}
        </div>
      </GhBox>
    </div>
  )
}
