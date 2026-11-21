import { useCallback, useState } from 'react'

const createId = () => `file-${Math.random().toString(36).slice(2, 9)}`
const isPythonFile = (file) => file.name.toLowerCase().endsWith('.py')

export function usePythonFileValidator() {
  const [entries, setEntries] = useState([])
  const [errors, setErrors] = useState([])

  const addFiles = useCallback(
    (fileList) => {
      const incoming = Array.from(fileList ?? [])
      const accepted = []
      const rejected = []

      incoming.forEach((file) => {
        if (!isPythonFile(file)) {
          const extension = file.name.includes('.') ? `.${file.name.split('.').pop()}` : 'sin extensión'
          rejected.push(
            `${file.name}: extensión ${extension} no admitida. Solo se aceptan archivos .py; no ZIP, carpetas ni enlaces externos.`,
          )
        } else if (entries.some((entry) => entry.file.name === file.name)) {
          rejected.push(`${file.name}: ya fue agregado a la lista de entregables.`)
        } else {
          accepted.push({ id: createId(), file, studentName: '' })
        }
      })

      setEntries((current) => [...current, ...accepted])
      setErrors((current) => [...current, ...rejected])
    },
    [entries],
  )

  const updateStudentName = useCallback((id, studentName) => {
    setEntries((current) => current.map((entry) => (entry.id === id ? { ...entry, studentName } : entry)))
  }, [])

  const removeEntry = useCallback((id) => {
    setEntries((current) => current.filter((entry) => entry.id !== id))
  }, [])

  const clearErrors = useCallback(() => setErrors([]), [])

  const reset = useCallback(() => {
    setEntries([])
    setErrors([])
  }, [])

  const isReady = entries.length > 0 && entries.every((entry) => entry.studentName.trim().length > 0)

  return { entries, errors, addFiles, updateStudentName, removeEntry, clearErrors, reset, isReady }
}
