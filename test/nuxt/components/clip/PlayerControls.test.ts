import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { clipFromTwitch } from '~~/test/mocks'

import PlayerControls from '~/components/clip/PlayerControls.vue'

vi.mock('~/composables/useClip', () => ({
  useClip: () => ({
    subtitle: 'Test Subtitle',
    submitter: 'Test Submitter',
    count: '5',
  }),
}))

vi.mock('#paraglide/messages', () => ({
  m: {
    previous: () => 'Previous',
    next: () => 'Next',
    submitter_name: ({ name }: { name: string }) => `Submitted by ${name}`,
  },
}))

describe('clip/PlayerControls.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = await mountSuspended(PlayerControls, {
      props: {
        clip: clipFromTwitch,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders title and external link when url exists', async () => {
    const wrapper = await mountSuspended(PlayerControls, {
      props: {
        clip: {
          ...clipFromTwitch,
          url: 'https://example.com',
        },
      },
    })
    expect(wrapper.html()).toContain(clipFromTwitch.title)
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
  })

  it('emits previous event when rewind button clicked', async () => {
    const wrapper = await mountSuspended(PlayerControls, {
      props: {
        clip: clipFromTwitch,
        previousDisabled: false,
      },
    })
    const buttons = wrapper.findAll('button')
    const prev = buttons.find((b) => b.text().toLowerCase().includes('previous'))
    expect(prev).toBeTruthy()
    await prev?.trigger('click')
    expect(wrapper.emitted('previous')).toBeTruthy()
  })

  it('emits next event when fast-forward clicked', async () => {
    const wrapper = await mountSuspended(PlayerControls, {
      props: {
        clip: clipFromTwitch,
      },
    })
    const buttons = wrapper.findAll('button')
    const next = buttons.find((b) => b.text().toLowerCase().includes('next'))
    expect(next).toBeTruthy()
    await next?.trigger('click')
    expect(wrapper.emitted('next')).toBeTruthy()
  })

  it('emits previous on ArrowLeft key', async () => {
    const wrapper = await mountSuspended(PlayerControls, {
      props: {
        clip: clipFromTwitch,
      },
    })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    await nextTick()
    expect(wrapper.emitted('previous')).toBeTruthy()
  })

  it('emits next on ArrowRight key', async () => {
    const wrapper = await mountSuspended(PlayerControls, {
      props: {
        clip: clipFromTwitch,
      },
    })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await nextTick()
    expect(wrapper.emitted('next')).toBeTruthy()
  })
})
