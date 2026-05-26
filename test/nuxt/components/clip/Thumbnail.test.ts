import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import ClipThumbnail from '~/components/clip/Thumbnail.vue'

const mockUseImage = vi.fn()
vi.mock('@vueuse/core', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@vueuse/core')>()),
  useImage: () => mockUseImage(),
}))

describe('clip/Thumbnail.vue', () => {
  const props = {
    src: 'https://example.com/thumb.jpg',
    alt: 'Example Clip Title',
  }

  it('renders a placeholder while the image is loading', async () => {
    mockUseImage.mockReturnValue({
      isLoading: ref(true),
      error: ref(null),
    })
    const wrapper = await mountSuspended(ClipThumbnail, { props })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.aspect-video.items-center').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'UIcon' }).exists()).toBe(true)
  })

  it('renders the image when loading is finished successfully', async () => {
    mockUseImage.mockReturnValue({
      isLoading: ref(false),
      error: ref(null),
    })
    const wrapper = await mountSuspended(ClipThumbnail, { props })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(props.src)
    expect(img.attributes('alt')).toBe(props.alt)
    expect(wrapper.findComponent({ name: 'UIcon' }).exists()).toBe(false)
  })

  it('renders the placeholder if the image fails to load', async () => {
    mockUseImage.mockReturnValue({
      isLoading: ref(false),
      error: ref(new Error('Failed to load')),
    })
    const wrapper = await mountSuspended(ClipThumbnail, { props })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'UIcon' }).exists()).toBe(true)
  })

  it('applies correct styling classes to the image', async () => {
    mockUseImage.mockReturnValue({
      isLoading: ref(false),
      error: ref(null),
    })
    const wrapper = await mountSuspended(ClipThumbnail, { props })
    const img = wrapper.find('img')
    expect(img.classes()).toContain('aspect-video')
    expect(img.classes()).toContain('rounded-md')
  })
})
