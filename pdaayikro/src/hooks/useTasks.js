import { useCallback, useEffect, useMemo, useState } from 'react'
import { getApiBaseUrl } from '../utils/api'

function isoToday() {
  return new Date().toISOString().slice(0, 10)
}

export default function useTasks(userId, dateIso = isoToday()) {
  const API_BASE_URL = useMemo(() => getApiBaseUrl(), [])
  const [tasks, setTasks] = useState([])
  const [status, setStatus] = useState({ loading: false, error: '' })

  const reload = useCallback(async () => {
    if (!userId) return
    try {
      setStatus({ loading: true, error: '' })
      const res = await fetch(`${API_BASE_URL}/api/tasks?userId=${userId}&date=${dateIso}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load tasks')
      setTasks(data)
      setStatus({ loading: false, error: '' })
    } catch (e) {
      setStatus({ loading: false, error: e?.message || 'Failed to load tasks' })
    }
  }, [API_BASE_URL, dateIso, userId])

  useEffect(() => {
    reload()
  }, [reload])

  const createTask = useCallback(
    async (title) => {
      const trimmed = String(title || '').trim()
      if (!trimmed) return
      const res = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title: trimmed, dueDate: dateIso }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to create task')
      setTasks((prev) => [data, ...prev])
    },
    [API_BASE_URL, dateIso, userId],
  )

  const updateTask = useCallback(
    async (taskId, action) => {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to update task')

      if (action === 'shiftTomorrow' || action === 'complete') {
        setTasks((prev) => prev.filter((t) => t.id !== taskId))
      } else {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? data : t)))
      }
    },
    [API_BASE_URL, userId],
  )

  const deleteTask = useCallback(
    async (taskId) => {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}?userId=${userId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to delete task')
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    },
    [API_BASE_URL, userId],
  )

  return { tasks, status, reload, createTask, updateTask, deleteTask }
}

