import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { IntegrationID } from '@/integrations'

import IntegrationIcon from '../IntegrationIcon.vue'

describe('IntegrationIcon.vue', () => {
  const wrapper = shallowMount(IntegrationIcon, {
    props: {
      id: IntegrationID.TWITCH,
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
