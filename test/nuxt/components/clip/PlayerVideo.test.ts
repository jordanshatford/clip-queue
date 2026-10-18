import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import PlayerVideo from '~/components/clip/PlayerVideo.vue'

vi.mock('@videojs/html/video/player', () => ({}))
vi.mock('@videojs/html/video/skin', () => ({}))
vi.mock('@videojs/html/media/hlsjs-video', () => ({}))

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

  it('renders a native video element for non-HLS sources', async () => {
    const wrapper = await mountSuspended(PlayerVideo, {
      props: {
        src: 'https://example.com/video.mp4',
        title: 'Test Video',
        poster: 'https://example.com/poster.jpg',
      },
    })
    const video = wrapper.find('video')
    expect(video.exists()).toBe(true)
    expect(video.attributes('src')).toBe('https://example.com/video.mp4')
    expect(video.attributes('autoplay')).toBeDefined()
    expect(wrapper.find('hlsjs-video').exists()).toBe(false)
    expect(wrapper.find('video-player').attributes('poster')).toBe('https://example.com/poster.jpg')
    expect(wrapper.find('video-player').attributes('content-title')).toBe('Test Video')
  })

  it('renders the HLS adapter for HLS sources with query strings', async () => {
    const wrapper = await mountSuspended(PlayerVideo, {
      props: {
        src: 'https://example.com/video.m3u8?token=123',
      },
    })
    expect(wrapper.find('hlsjs-video').attributes('src')).toBe(
      'https://example.com/video.m3u8?token=123',
    )
    expect(wrapper.find('video').exists()).toBe(false)
  })

  it('seeks to the requested start time when media metadata loads', async () => {
    const wrapper = await mountSuspended(PlayerVideo, {
      props: {
        src: 'https://example.com/video.mp4',
        start: 10,
      },
    })
    const video = wrapper.find('video').element as HTMLVideoElement
    const currentTime = vi.spyOn(video, 'currentTime', 'set')
    await wrapper.find('video').trigger('loadedmetadata')
    expect(currentTime).toHaveBeenCalledWith(10)
  })

  it('seeks on HLS media when metadata loads', async () => {
    const wrapper = await mountSuspended(PlayerVideo, {
      props: {
        src: 'https://example.com/video.m3u8',
        start: 10,
      },
    })
    const media = wrapper.find('hlsjs-video').element as HTMLElement & { currentTime: number }
    Object.defineProperty(media, 'currentTime', { configurable: true, value: 0, writable: true })
    await wrapper.find('hlsjs-video').trigger('loadedmetadata')
    expect(media.currentTime).toBe(10)
  })
})
