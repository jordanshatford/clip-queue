import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import App from '~/app.vue'

describe('app.vue', () => {
  it('mounts successfully', async () => {
    const component = await mountSuspended(App)
    expect(component.exists()).toBe(true)
  })
})
