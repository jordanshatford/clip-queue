import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { clips } from '@/integrations/twitch'

import IntegrationProviders from '../IntegrationProviders.vue'

describe('IntegrationProviders.vue', () => {
  const wrapper = shallowMount(IntegrationProviders, {
    props: {
      providers: [clips],
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
