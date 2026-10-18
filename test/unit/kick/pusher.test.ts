import { afterEach, describe, expect, it, vi } from 'vitest'

import { Client } from '../../../shared/kick'

vi.mock('ofetch', () => ({
  ofetch: {
    create: vi.fn(() => vi.fn()),
  },
}))

class MockWebSocket {
  public static readonly CONNECTING = 0
  public static readonly OPEN = 1
  public static readonly CLOSING = 2
  public static readonly CLOSED = 3
  public static instances: MockWebSocket[] = []

  public readyState = MockWebSocket.CONNECTING
  public sent: string[] = []
  public onopen: ((event: Event) => void) | null = null
  public onerror: ((event: Event) => void) | null = null
  public onmessage: ((event: MessageEvent<unknown>) => void) | null = null
  public onclose: ((event: CloseEvent) => void) | null = null

  public constructor(public readonly url: string) {
    MockWebSocket.instances.push(this)
  }

  public send(data: string): void {
    this.sent.push(data)
  }

  public close(): void {
    this.readyState = MockWebSocket.CLOSED
  }

  public open(): void {
    this.readyState = MockWebSocket.OPEN
    this.onopen?.(new Event('open'))
  }

  public receive(data: string): void {
    this.onmessage?.(new MessageEvent('message', { data }))
  }
}

describe('shared/kick/pusher', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    MockWebSocket.instances = []
  })

  it('replies to Pusher heartbeat pings', async () => {
    vi.stubGlobal('WebSocket', MockWebSocket)

    const client = new Client()
    const connecting = client.connect()
    const socket = MockWebSocket.instances[0]
    if (!socket) {
      throw new Error('Expected the Kick chat WebSocket to be created.')
    }

    expect(socket.url).toBe(
      'wss://ws-us2.pusher.com/app/34bf7a0ff419a2a775b9?protocol=7&client=js&version=8.4.0-rc2&flash=false',
    )

    socket.open()
    await connecting
    socket.receive(JSON.stringify({ event: 'pusher:ping', data: {} }))

    expect(socket.sent).toEqual([JSON.stringify({ event: 'pusher:pong', data: {} })])
    client.close()
  })
})
