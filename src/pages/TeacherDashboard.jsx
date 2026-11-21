import { useState } from 'react'
import DiagnosisWorkspace from '../components/domain/DiagnosisWorkspace'
import GroupEditor from '../components/domain/GroupEditor'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'

export default function TeacherDashboard({ store, currentUser, selectedGroupId, onSelectGroup }) {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [dialog, setDialog] = useState(null)

  const saveGroup = (form) => {
    if (dialog?.group) store.updateGroup(dialog.group.id, form)
    else store.addGroup({ ...form, teacherId: currentUser.id })
    setDialog(null)
  }

  const removeGroup = () => {
    const removedId = dialog?.group?.id
    store.deleteGroup(removedId)
    if (removedId === selectedGroupId) {
      onSelectGroup(store.groups.find((group) => group.id !== removedId)?.id)
      setSelectedStudent(null)
    }
    setDialog(null)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Espacio del docente"
        title="De la entrega de código a la"
        emphasis="evidencia"
        description="Gestione grupos NRC, cargue entregables .py y explore los diagnósticos por pilar, sugerencias opcionales y pensamiento computacional."
        actions={
          <Button icon="plus" onClick={() => setDialog({ mode: 'form', group: null })}>
            Nuevo grupo
          </Button>
        }
      />

      <div className="mt-6">
        <DiagnosisWorkspace
          groups={store.groups}
          students={store.students}
          studentsByGroup={store.studentsByGroup}
          diagnosesByStudent={store.diagnosesByStudent}
          users={store.users}
          selectedGroupId={selectedGroupId}
          onSelectGroup={onSelectGroup}
          selectedStudent={selectedStudent}
          onSelectStudent={setSelectedStudent}
          onClearStudent={() => setSelectedStudent(null)}
          onEditGroup={(group) => setDialog({ mode: 'form', group })}
          onDeleteGroup={(group) => setDialog({ mode: 'delete', group })}
          onAddUploads={(entries, groupId) => store.addUploadedDiagnoses(entries, groupId, currentUser.id)}
        />
      </div>

      <GroupEditor
        key={dialog ? `${dialog.mode}-${dialog.group?.id ?? 'new'}` : 'closed'}
        dialog={dialog?.mode}
        group={dialog?.group}
        onClose={() => setDialog(null)}
        onSave={saveGroup}
        onDelete={removeGroup}
      />
    </main>
  )
}
