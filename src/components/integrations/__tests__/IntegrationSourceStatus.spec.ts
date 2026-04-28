import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { ClipSourceStatus } from '@/integrations/common'

import IntegrationSourceStatus from '../IntegrationSourceStatus.vue'

describe('IntegrationSourceStatus.vue', () => {
  const wrapper = shallowMount(IntegrationSourceStatus, {
    props: {
      status: ClipSourceStatus.CONNECTED,
    },
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
