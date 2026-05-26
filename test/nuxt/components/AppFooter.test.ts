import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import AppFooter from '~/components/AppFooter.vue'

describe('AppFooter.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = await mountSuspended(AppFooter)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders copyright year range', async () => {
    const wrapper = await mountSuspended(AppFooter)
    const currentYear = new Date().getFullYear()
    expect(wrapper.text()).toContain(`Copyright © 2021-${currentYear}`)
  })

  it('renders GitHub link', async () => {
    const wrapper = await mountSuspended(AppFooter)
    const githubButton = wrapper.find('[aria-label="GitHub"]')
    expect(githubButton.exists()).toBe(true)
    expect(githubButton.attributes('href') ?? githubButton.attributes('to')).toBe(
      'https://github.com/jordanshatford/clip-queue',
    )
  })
})
