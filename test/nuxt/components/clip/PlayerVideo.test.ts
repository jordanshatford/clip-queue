import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import PlayerVideo from '~/components/clip/PlayerVideo.vue'

const currentTimeMock = vi.fn()
const readyMock = vi.fn((cb: () => void) => cb())
const disposeMock = vi.fn()
vi.mock('video.js', () => {
  return {
    default: vi.fn(() => ({
      ready: readyMock,
      currentTime: currentTimeMock,
      dispose: disposeMock,
    })),
  }
})

vi.mock('video.js/dist/video-js.css', () => ({}))

describe('clip/PlayerVideo.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = await mountSuspended(PlayerVideo, {
      props: {
        src: 'https://example.com/video.mp4',
        title: 'Test Video',
        poster: '',
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders video element', async () => {
    const wrapper = await mountSuspended(PlayerVideo, {
      props: {
        src: 'https://example.com/video.mp4',
        title: 'Test Video',
      },
    })
    const video = wrapper.find('video')
    expect(video.exists()).toBe(true)
    expect(video.attributes('title')).toBe('Test Video')
  })

  it('calls currentTime when start is provided', async () => {
    await mountSuspended(PlayerVideo, {
      props: {
        src: 'https://example.com/video.mp4',
        start: 10,
      },
    })
    expect(readyMock).toHaveBeenCalled()
    expect(currentTimeMock).toHaveBeenCalledWith(10)
  })

  it('disposes player on unmount', async () => {
    const wrapper = await mountSuspended(PlayerVideo, {
      props: {
        src: 'https://example.com/video.mp4',
      },
    })
    wrapper.unmount()
    expect(disposeMock).toHaveBeenCalled()
  })
})
