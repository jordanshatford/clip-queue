import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { IntegrationStatus } from '@/integrations/common/types'

import IntegrationStatusTag from '../IntegrationStatusTag.vue'

describe('IntegrationStatusTag.vue', () => {
  const wrapper = shallowMount(IntegrationStatusTag, {
    props: {
      status: IntegrationStatus.HEALTHY,
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
