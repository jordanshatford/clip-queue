import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { clipFromTwitch } from '~~/test/mocks'

import ClipCard from '~/components/clip/Card.vue'
import { IntegrationID } from '~/integrations'

vi.mock('~/composables/useClip', () => ({
  useClip: () => ({
    subtitle: 'Some Clip Subtitle - Test',
    submitter: 'Test Submitter',
    count: '5',
    source: undefined,
    provider: { id: IntegrationID.TWITCH_CLIPS },
    playerConfig: {},
    equals: () => false,
  }),
}))

vi.mock('#paraglide/messages', () => ({
  m: {
    submitter_name: ({ name }: { name: string }) => `Submitted by ${name}`,
    play: () => 'Play',
    remove: () => 'Remove',
  },
}))

describe('ClipCard.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = await mountSuspended(ClipCard, {
      props: {
        clip: clipFromTwitch,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders clip title', async () => {
    const wrapper = await mountSuspended(ClipCard, {
      props: { clip: clipFromTwitch },
    })
    expect(wrapper.html()).toContain(clipFromTwitch.title)
  })

  it('renders subtitle from useClip', async () => {
    const wrapper = await mountSuspended(ClipCard, {
      props: { clip: clipFromTwitch },
    })
    expect(wrapper.html()).toContain('Some Clip Subtitle - Test')
  })

  it('renders submitter text', async () => {
    const wrapper = await mountSuspended(ClipCard, {
      props: { clip: clipFromTwitch },
    })
    expect(wrapper.html()).toContain('Submitted by Test Submitter')
  })

  it('renders submitter count badge when present', async () => {
    const wrapper = await mountSuspended(ClipCard, {
      props: { clip: clipFromTwitch },
    })
    const badge = wrapper.findComponent({ name: 'UBadge' })
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toContain('5')
  })

  it('emits play event when play button is clicked', async () => {
    const wrapper = await mountSuspended(ClipCard, {
      props: { clip: clipFromTwitch },
    })
    const buttons = wrapper.findAll('button')
    const playButton = buttons.find((b) => b.text().toLowerCase().includes('play'))
    expect(playButton).toBeTruthy()
    await playButton?.trigger('click')
    expect(wrapper.emitted('play')).toBeTruthy()
    expect(wrapper.emitted('play')?.length).toBe(1)
  })

  it('emits remove event when remove button is clicked', async () => {
    const wrapper = await mountSuspended(ClipCard, {
      props: { clip: clipFromTwitch },
    })
    const buttons = wrapper.findAll('button')
    const removeButton = buttons.find((b) => b.text().toLowerCase().includes('remove'))
    expect(removeButton).toBeTruthy()
    await removeButton?.trigger('click')
    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')?.length).toBe(1)
  })
})
