import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { ClipSourceStatus } from '@cq/sources'

import SourceIndicator from '../SourceIndicator.vue'

describe('SourceIndicator.vue', () => {
  const wrapper = shallowMount(SourceIndicator, {
    props: {
      status: ClipSourceStatus.CONNECTED
    },
    global: {
      plugins: [createTestingPinia()]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
