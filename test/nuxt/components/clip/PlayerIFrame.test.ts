import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import PlayerIFrame from '~/components/clip/PlayerIFrame.vue'

describe('clip/PlayerIFrame.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = await mountSuspended(PlayerIFrame, {
      props: {
        src: 'https://example.com/embed',
        title: 'My Video',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders iframe with correct src and title', async () => {
    const wrapper = await mountSuspended(PlayerIFrame, {
      props: {
        src: 'https://example.com/embed',
        title: 'My Video',
      },
    })
    const iframe = wrapper.find('iframe')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('src')).toBe('https://example.com/embed')
    expect(iframe.attributes('title')).toBe('My Video')
  })

  it('handles missing title gracefully', async () => {
    const wrapper = await mountSuspended(PlayerIFrame, {
      props: {
        src: 'https://example.com/embed',
      },
    })
    const iframe = wrapper.find('iframe')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('src')).toBe('https://example.com/embed')
    expect(iframe.attributes('title')).toBeUndefined()
  })
})
