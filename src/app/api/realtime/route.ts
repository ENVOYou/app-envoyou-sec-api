import { NextResponse } from 'next/server'

export const runtime = 'edge'

function sseStream() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      let count = 0
      // send a comment to establish stream
      controller.enqueue(encoder.encode(': ok\n\n'))

      const id = setInterval(() => {
        count += Math.floor(Math.random() * 5) + 1
        const payload = {
          timestamp: Date.now(),
          live_requests: count,
        }
        const chunk = `data: ${JSON.stringify(payload)}\n\n`
        controller.enqueue(encoder.encode(chunk))
      }, 2000)

      // send occasional heartbeat
      const hb = setInterval(() => {
        controller.enqueue(encoder.encode(`event: heartbeat\ndata: {"ts":${Date.now()}}\n\n`))
      }, 15000)

      // attach cleanup refs via closure
      ;(controller as unknown as { __cleanup?: () => void }).__cleanup = () => {
        clearInterval(id)
        clearInterval(hb)
      }
    },
    cancel(controller) {
      try {
        const c = controller as unknown as { __cleanup?: () => void }
        if (c.__cleanup) c.__cleanup()
      } catch {
        // ignore
      }
    }
  })

  return stream
}

export async function GET(request: Request) {
  // Quick auth: allow if Authorization header present or cookie header exists.
  // This is intentionally simple (quick win). For production, validate session or tokens securely.
  const authHeader = request.headers.get('authorization')
  const cookieHeader = request.headers.get('cookie')

  if (!authHeader && !cookieHeader) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const stream = sseStream()
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    }
  })
}
