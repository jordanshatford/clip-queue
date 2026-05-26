import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { clipFromTwitch } from '~~/test/mocks'

import type { Clip } from '~/integrations'

import ClipQueue from '~/components/clip/Queue.vue'

vi.mock('#paraglide/messages', () => ({
  m: {
    clear: () => 'Clear',
    open: () => 'Open',
    close: () => 'Close',
    submitter_name: ({ name }: { name: string }) => `Submitted by ${name}`,
    play: () => 'Play',
    remove: () => 'Remove',
    no_clips_upcoming: () => 'No clips upcoming',
    no_clips_upcoming_description: () => 'No clips upcoming description',
  },
}))

describe('clip/Queue.vue', () => {
  const mockClip1: Clip = { ...clipFromTwitch, id: 'clip-1', title: 'First Clip' }
  const mockClip2: Clip = { ...clipFromTwitch, id: 'clip-2', title: 'Second Clip' }

  describe('Rendering', () => {
    it('mounts and renders default empty state correctly', async () => {
      const wrapper = await mountSuspended(ClipQueue, {
        props: { clips: [] },
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Queue')
      const buttons = wrapper.findAllComponents({ name: 'UButton' })
      expect(buttons[0]?.props('disabled')).toBe(true)
    })

    it('renders custom title and the correct number of ClipCards', async () => {
      const wrapper = await mountSuspended(ClipQueue, {
        props: {
          title: 'My Custom Queue',
          clips: [mockClip1, mockClip2],
        },
        global: {
          stubs: { ClipCard: true },
        },
      })
      expect(wrapper.text()).toContain('My Custom Queue')
      const clipCards = wrapper.findAllComponents({ name: 'ClipCard' })
      expect(clipCards).toHaveLength(2)
      expect(clipCards[0]?.props('clip')).toEqual(mockClip1)
    })
  })

  describe('Interactions & Emits', () => {
    it('emits "clear" when the clear button is clicked', async () => {
      const wrapper = await mountSuspended(ClipQueue, {
        props: { clips: [mockClip1] },
      })
      const clearButton = wrapper.findAllComponents({ name: 'UButton' })[0]
      expect(clearButton?.props('disabled')).toBe(false)
      await clearButton?.trigger('click')
      expect(wrapper.emitted('clear')).toBeTruthy()
    })

    it('emits "open" and displays correct text when isOpen is false', async () => {
      const wrapper = await mountSuspended(ClipQueue, {
        props: { clips: [], isOpen: false },
      })
      const toggleButton = wrapper.findAllComponents({ name: 'UButton' })[1]
      expect(toggleButton?.text()).toContain('Open')
      expect(toggleButton?.props('color')).toBe('neutral')
      await toggleButton?.trigger('click')
      expect(wrapper.emitted('open')).toBeTruthy()
    })

    it('emits "close" and displays correct text when isOpen is true', async () => {
      const wrapper = await mountSuspended(ClipQueue, {
        props: { clips: [], isOpen: true },
      })
      const toggleButton = wrapper.findAllComponents({ name: 'UButton' })[1]
      expect(toggleButton?.text()).toContain('Close')
      expect(toggleButton?.props('color')).toBe('error')
      await toggleButton?.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Child Component Forwarding', () => {
    it('forwards "play" and "remove" events from ClipCard', async () => {
      const wrapper = await mountSuspended(ClipQueue, {
        props: { clips: [mockClip1] },
        global: {
          stubs: { ClipCard: true },
        },
      })
      const clipCard = wrapper.findComponent({ name: 'ClipCard' })
      await clipCard.vm.$emit('play', mockClip1)
      await clipCard.vm.$emit('remove', mockClip1)
      expect(wrapper.emitted('play')?.[0]).toEqual([mockClip1])
      expect(wrapper.emitted('remove')?.[0]).toEqual([mockClip1])
    })
  })
})
