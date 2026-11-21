import { useState } from 'react'
import RepoTabsHeader from '../layout/RepoTabsHeader'
import GhBox from '../ui/GhBox'
import MethodologicalBanner from '../ui/MethodologicalBanner'
import GroupCard from './GroupCard'
import GroupSummaryView from './GroupSummaryView'
import PythonFileUploader from './PythonFileUploader'
import StudentDiagnosisDetail from './StudentDiagnosisDetail'

export default function DiagnosisWorkspace({
  groups,
  students,
  studentsByGroup,
  diagnosesByStudent,
  users,
  readOnly = false,
  selectedGroupId,
  onSelectGroup,
  selectedStudent,
  onSelectStudent,
  onClearStudent,
  onEditGroup,
  onDeleteGroup,
  onAddUploads,
}) {
  const [activeTab, setActiveTab] = useState('resumen')
  const activeGroup = groups.find((group) => group.id === selectedGroupId)
  const activeDiagnosis = selectedStudent ? diagnosesByStudent[selectedStudent.id] : null
  const diagnosisCount = (studentsByGroup[selectedGroupId] ?? []).filter(
    (student) => Boolean(diagnosesByStudent[student.id]),
  ).length
  const teacherName = (teacherId) => users.find((user) => user.id === teacherId)?.name ?? 'Sin asignar'

  const tabs = [
    { id: 'resumen', label: 'Resumen del grupo', icon: 'chart', count: diagnosisCount },
    ...(readOnly ? [] : [{ id: 'carga', label: 'Carga de trabajos .py', icon: 'upload' }]),
    {
      id: 'diagnostico',
      label: 'Diagnóstico individual',
      icon: 'file',
      count: selectedStudent ? 1 : 0,
      disabled: !selectedStudent,
    },
  ]

  const handleSelectGroup = (id) => {
    onSelectGroup(id)
    onClearStudent()
    setActiveTab('resumen')
  }

  const handleOpenStudent = (student) => {
    onSelectStudent(student)
    setActiveTab('diagnostico')
  }

  return (
    <div className="space-y-5">
      <GhBox
        title="Grupos NRC"
        subtitle={readOnly ? 'Listado para supervisión' : 'Seleccione un grupo para trabajar con sus entregables'}
        actions={
          <span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 font-mono text-[10px] text-slate-500">
            {groups.length} grupo(s)
          </span>
        }
        bodyClassName="p-4"
      >
        {groups.length === 0 ? (
          <MethodologicalBanner tone="readonly" title="Sin grupos disponibles">
            Cree un grupo NRC para comenzar a registrar entregables.
          </MethodologicalBanner>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                studentCount={studentsByGroup[group.id]?.length ?? 0}
                teacherName={teacherName(group.teacherId)}
                editable={!readOnly}
                selected={group.id === selectedGroupId}
                onSelect={handleSelectGroup}
                onEdit={onEditGroup}
                onDelete={onDeleteGroup}
              />
            ))}
          </div>
        )}
      </GhBox>

      {!activeGroup ? (
        <MethodologicalBanner tone="institutional" title="Seleccione un grupo para continuar">
          Las cargas, los resúmenes y los diagnósticos se muestran en el contexto del NRC elegido.
        </MethodologicalBanner>
      ) : (
        <section>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              NRC <code className="font-mono text-brand">{activeGroup.nrc}</code> · {activeGroup.subject}
            </h2>
            <p className="font-mono text-xs text-slate-500">Período {activeGroup.period}</p>
          </div>

          <RepoTabsHeader tabs={tabs} activeId={activeTab} onChange={setActiveTab} label="Flujo de diagnóstico" />

          <div className="pt-4">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                role="tabpanel"
                id={`panel-${tab.id}`}
                aria-labelledby={`tab-${tab.id}`}
                hidden={activeTab !== tab.id}
                tabIndex={0}
              >
                {activeTab !== tab.id ? null : (
                  <>
                    {tab.id === 'resumen' ? (
                      <GroupSummaryView
                        group={activeGroup}
                        students={students}
                        diagnosesByStudent={diagnosesByStudent}
                        readOnly={readOnly}
                        onOpenStudent={handleOpenStudent}
                      />
                    ) : null}
                    {tab.id === 'carga' ? (
                      <PythonFileUploader
                        group={activeGroup}
                        onComplete={(entries) => onAddUploads?.(entries, activeGroup.id)}
                      />
                    ) : null}
                    {tab.id === 'diagnostico' ? (
                      selectedStudent && activeDiagnosis ? (
                        <StudentDiagnosisDetail
                          student={selectedStudent}
                          group={activeGroup}
                          diagnosis={activeDiagnosis}
                          readOnly={readOnly}
                          onBack={() => {
                            onClearStudent()
                            setActiveTab('resumen')
                          }}
                        />
                      ) : (
                        <MethodologicalBanner tone="institutional" title="Seleccione un estudiante">
                          Abra la pestaña Resumen del grupo y elija un estudiante para ver su diagnóstico individual.
                        </MethodologicalBanner>
                      )
                    ) : null}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
