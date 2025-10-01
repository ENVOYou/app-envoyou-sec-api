import { useEffect, useRef, useState } from 'react'

type SSEData = unknown

type UseEventSourceReturn = {
  data: SSEData | null
  connected: boolean
  error: string | null
  close: () => void
}

/**
 * Simple EventSource hook for client components.
 * - Connects to the provided `path` (defaults to /api/realtime)
 * - Parses JSON payloads when possible and exposes latest `data`
 */
export default function useEventSource(path = '/v1/realtime'): UseEventSourceReturn {
  const [data, setData] = useState<SSEData | null>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    let es: EventSource
    try {
      es = new EventSource(path)
      esRef.current = es
    } catch (err: unknown) {
      setError(String(err))
      return
    }

    es.onopen = () => {
      setConnected(true)
      setError(null)
    }

    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data)
        setData(parsed)
      } catch {
        setData(e.data)
      }
    }

    es.onerror = () => {
      setError('EventSource error')
      setConnected(false)
      // Don't auto-close here; allow the browser to attempt reconnects
    }

    return () => {
      try {
        es.close()
      } catch {
        // ignore
      }
      esRef.current = null
    }
  }, [path])

  return {
    data,
    connected,
    error,
    close: () => esRef.current?.close(),
  }
}
