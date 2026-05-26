import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { clipFromKick, clipFromTwitch } from '~~/test/mocks'

import type { Clip } from '~/integrations'

import Player from '~/components/clip/Player.vue'

const useClipMock = vi.fn()
vi.mock('~/composables/useClip', () => ({
  useClip: (clip: Clip) => useClipMock(clip),
}))

vi.mock('~/components/clip/PlayerIFrame.vue', () => ({
  default: { template: '<div data-test="iframe" />' },
}))
vi.mock('~/components/clip/PlayerVideo.vue', () => ({
  default: { template: '<div data-test="video" />' },
}))
vi.mock('~/components/clip/PlayerUnsupported.vue', () => ({
  default: { template: '<div data-test="unsupported" />' },
}))
vi.mock('~/components/clip/PlayerControls.vue', () => ({
  default: {
    props: ['clip', 'previousDisabled'],
    template: `
      <div>
        <button data-test="prev" @click="$emit('previous')">prev</button>
        <button data-test="next" @click="$emit('next')">next</button>
      </div>
    `,
  },
}))

describe('clip/Player.vue', () => {
  it('renders iframe player when config type is iframe', async () => {
    useClipMock.mockReturnValue({
      playerConfig: { type: 'iframe' },
    })
    const wrapper = await mountSuspended(Player, {
      props: { clip: clipFromTwitch },
    })
    expect(wrapper.find('[data-test="iframe"]').exists()).toBe(true)
  })

  it('renders video player when config type is video', async () => {
    useClipMock.mockReturnValue({
      playerConfig: { type: 'video' },
    })
    const wrapper = await mountSuspended(Player, {
      props: { clip: clipFromKick },
    })
    expect(wrapper.find('[data-test="video"]').exists()).toBe(true)
  })

  it('renders fallback when config is unknown', async () => {
    useClipMock.mockReturnValue({
      playerConfig: { type: 'unknown' },
    })
    const wrapper = await mountSuspended(Player, {
      props: { clip: clipFromTwitch },
    })
    expect(wrapper.find('[data-test="unsupported"]').exists()).toBe(true)
  })

  it('emits previous and next events from controls', async () => {
    useClipMock.mockReturnValue({
      playerConfig: { type: 'video' },
    })
    const wrapper = await mountSuspended(Player, {
      props: {
        clip: clipFromTwitch,
        previousDisabled: false,
      },
    })
    await wrapper.find('[data-test="prev"]').trigger('click')
    await wrapper.find('[data-test="next"]').trigger('click')
    expect(wrapper.emitted('previous')).toBeTruthy()
    expect(wrapper.emitted('next')).toBeTruthy()
  })
})
