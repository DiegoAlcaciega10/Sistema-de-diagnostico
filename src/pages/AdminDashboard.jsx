import { useState } from 'react'
import AccountsPanel from '../components/admin/AccountsPanel'
import CriteriaPanel from '../components/admin/CriteriaPanel'
import PromptsPanel from '../components/admin/PromptsPanel'
import ServicesPanel from '../components/admin/ServicesPanel'
import DiagnosisWorkspace from '../components/domain/DiagnosisWorkspace'
import PageHeader from '../components/layout/PageHeader'
import RepoTabsHeader from '../components/layout/RepoTabsHeader'

export default function AdminDashboard({ store, currentUser, initialTab, selectedGroupId, onSelectGroup }) {
  const [activeTab, setActiveTab] = useState(initialTab ?? 'cuentas')
  const [selectedStudent, setSelectedStudent] = useState(null)

  const tabs = [
    { id: 'cuentas', label: 'Cuentas y roles', icon: 'users', count: store.users.length },
    { id: 'servicios', label: 'Servicios', icon: 'server', count: store.services.length },
    { id: 'criterios', label: 'Criterios y umbrales', icon: 'settings', count: store.criteria.length },
    { id: 'prompts', label: 'Prompts de IA', icon: 'robot', count: store.prompts.length },
    { id: 'supervision', label: 'Supervisión global', icon: 'eye', count: store.groups.length },
  ]

  const supervision = (
    <DiagnosisWorkspace
      groups={store.groups}
      students={store.students}
      studentsByGroup={store.studentsByGroup}
      diagnosesByStudent={store.diagnosesByStudent}
      users={store.users}
      readOnly
      selectedGroupId={selectedGroupId}
      onSelectGroup={onSelectGroup}
      selectedStudent={selectedStudent}
      onSelectStudent={setSelectedStudent}
      onClearStudent={() => setSelectedStudent(null)}
    />
  )

  const panels = {
    cuentas: (
      <AccountsPanel
        users={store.users}
        currentUser={currentUser}
        onAdd={store.addUser}
        onUpdate={store.updateUser}
        onToggle={(id, active) => store.updateUser(id, { active })}
        onDelete={store.deleteUser}
      />
    ),
    servicios: <ServicesPanel services={store.services} />,
    criterios: <CriteriaPanel criteria={store.criteria} />,
    prompts: <PromptsPanel prompts={store.prompts} />,
    supervision,
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Panel de administración"
        title="Gobernanza y"
        emphasis="supervisión"
        suffix="del sistema"
        description="Administre cuentas, supervise servicios, consulte los criterios metodológicos y revise diagnósticos sin alterarlos."
      />

      <div className="mt-6">
        <RepoTabsHeader tabs={tabs} activeId={activeTab} onChange={setActiveTab} label="Secciones de administración" />
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            tabIndex={0}
          >
            {activeTab === tab.id ? <div className="pt-4">{panels[tab.id]}</div> : null}
          </div>
        ))}
      </div>
    </main>
  )
}
