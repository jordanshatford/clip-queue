import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { ClipProvider } from '@cq/providers'
import ProviderName from '../ProviderName.vue'

describe('ProviderName.vue', () => {
  const wrapper = shallowMount(ProviderName, {
    props: {
      provider: ClipProvider.TWITCH
    },
    global: {
      plugins: [createTestingPinia()]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
