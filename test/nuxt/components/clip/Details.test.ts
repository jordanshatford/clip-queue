import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { clipFromTwitch } from '~~/test/mocks'

import ClipDetails from '~/components/clip/Details.vue'

vi.mock('~/composables/useClip', () => ({
  useClip: () =>
    computed(() => ({
      subtitle: 'Some Subtitle',
    })),
}))

describe('clip/Details.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = await mountSuspended(ClipDetails, {
      props: {
        data: clipFromTwitch,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders clip title', async () => {
    const wrapper = await mountSuspended(ClipDetails, {
      props: {
        data: clipFromTwitch,
      },
    })
    expect(wrapper.html()).toContain(clipFromTwitch.title)
  })

  it('renders subtitle from useClip', async () => {
    const wrapper = await mountSuspended(ClipDetails, {
      props: {
        data: clipFromTwitch,
      },
    })
    expect(wrapper.html()).toContain('Some Subtitle')
  })

  it('renders thumbnail with correct src and alt', async () => {
    const wrapper = await mountSuspended(ClipDetails, {
      props: {
        data: clipFromTwitch,
      },
    })
    const thumb = wrapper.findComponent({ name: 'ClipThumbnail' })
    expect(thumb.exists()).toBe(true)
    expect(thumb.props('src')).toBe(clipFromTwitch.thumbnailUrl)
    expect(thumb.props('alt')).toBe(clipFromTwitch.title)
  })
})
