import { useEffect, useMemo, useRef } from 'react'

export default function useActivityTracker(user) {
  const API_BASE_URL = useMemo(() => import.meta.env.VITE_API_BASE_URL || 'http://localhost:5057', [])
  const lastInteractionRef = useRef(Date.now())
  const bucketRef = useRef(0)
  const flushInFlightRef = useRef(false)

  useEffect(() => {
    if (!user?.id) return

    const mark = () => {
      lastInteractionRef.current = Date.now()
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach((evt) => window.addEventListener(evt, mark, { passive: true }))

    const tick = async () => {
      const now = Date.now()
      const isActive = now - lastInteractionRef.current < 15000
      if (isActive) bucketRef.current += 5

      if (bucketRef.current >= 30 && !flushInFlightRef.current) {
        flushInFlightRef.current = true
        const seconds = bucketRef.current
        bucketRef.current = 0
        try {
          await fetch(`${API_BASE_URL}/api/activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, seconds, source: 'activity-tracker' }),
          })
        } catch {
          bucketRef.current += seconds
        } finally {
          flushInFlightRef.current = false
        }
      }
    }

    const interval = setInterval(tick, 5000)

    return () => {
      clearInterval(interval)
      events.forEach((evt) => window.removeEventListener(evt, mark))
    }
  }, [API_BASE_URL, user?.id])
}

