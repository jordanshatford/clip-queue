import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { chat } from '@/integrations/twitch'

import IntegrationSource from '../IntegrationSource.vue'

describe('IntegrationSource.vue', () => {
  const wrapper = shallowMount(IntegrationSource, {
    props: {
      source: chat,
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
