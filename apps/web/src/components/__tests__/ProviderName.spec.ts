import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
