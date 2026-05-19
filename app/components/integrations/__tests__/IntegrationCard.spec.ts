import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { twitch } from '@/integrations/twitch'

import IntegrationCard from '../IntegrationCard.vue'

describe('IntegrationCard.vue', () => {
  const wrapper = shallowMount(IntegrationCard, {
    props: {
      modelValue: twitch,
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
