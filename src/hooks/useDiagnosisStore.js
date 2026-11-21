import { useCallback, useMemo, useState } from 'react'
import {
  createDiagnosisFromUpload,
  initialDiagnoses,
  initialGroups,
  initialServices,
  initialStudents,
  initialUsers,
  pillarCriteria,
  aiPrompts,
} from '../data/mockData'

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export function useDiagnosisStore() {
  const [users, setUsers] = useState(initialUsers)
  const [groups, setGroups] = useState(initialGroups)
  const [students, setStudents] = useState(initialStudents)
  const [diagnoses, setDiagnoses] = useState(initialDiagnoses)
  const services = initialServices
  const criteria = pillarCriteria
  const prompts = aiPrompts

  const addUser = useCallback((user) => {
    setUsers((current) => [...current, { ...user, id: createId('u') }])
  }, [])

  const updateUser = useCallback((id, changes) => {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, ...changes } : user)))
  }, [])

  const deleteUser = useCallback((id) => {
    setUsers((current) => current.filter((user) => user.id !== id))
  }, [])

  const addGroup = useCallback((group) => {
    setGroups((current) => [...current, { ...group, id: createId('g') }])
  }, [])

  const updateGroup = useCallback((id, changes) => {
    setGroups((current) => current.map((group) => (group.id === id ? { ...group, ...changes } : group)))
  }, [])

  const deleteGroup = useCallback(
    (id) => {
      const removedStudentIds = students.filter((student) => student.groupId === id).map((student) => student.id)
      setGroups((current) => current.filter((group) => group.id !== id))
      setStudents((current) => current.filter((student) => student.groupId !== id))
      setDiagnoses((current) => current.filter((diagnosis) => !removedStudentIds.includes(diagnosis.studentId)))
    },
    [students],
  )

  const addUploadedDiagnoses = useCallback((entries, groupId, teacherId) => {
    const newStudents = []
    const newDiagnoses = []

    entries.forEach(({ studentName, fileName }) => {
      const studentId = createId('s')
      newStudents.push({
        id: studentId,
        name: studentName.trim(),
        email: `${studentId}@estudiante.edu`,
        groupId,
        teacherId,
      })
      newDiagnoses.push(createDiagnosisFromUpload({ studentId, fileName }))
    })

    setStudents((current) => [...current, ...newStudents])
    setDiagnoses((current) => [...current, ...newDiagnoses])
    return newDiagnoses
  }, [])

  const studentsByGroup = useMemo(() => {
    return groups.reduce((accumulator, group) => {
      accumulator[group.id] = students.filter((student) => student.groupId === group.id)
      return accumulator
    }, {})
  }, [groups, students])

  const diagnosesByStudent = useMemo(() => {
    return diagnoses.reduce((accumulator, diagnosis) => {
      accumulator[diagnosis.studentId] = diagnosis
      return accumulator
    }, {})
  }, [diagnoses])

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
    students,
    studentsByGroup,
    diagnoses,
    diagnosesByStudent,
    addUploadedDiagnoses,
    services,
    criteria,
    prompts,
  }
}
