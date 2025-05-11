import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { ConfirmationService } from '@cq/ui'

import LogsPage from '../LogsPage.vue'

describe('LogsPage.vue', () => {
  const wrapper = shallowMount(LogsPage, {
    global: {
      plugins: [createTestingPinia(), ConfirmationService]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
