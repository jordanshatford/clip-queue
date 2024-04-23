import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { ConfirmationService } from '@cq/ui'

import HistoryPage from '../HistoryPage.vue'

describe('HistoryPage.vue', () => {
  const wrapper = shallowMount(HistoryPage, {
    global: {
      plugins: [createTestingPinia(), ConfirmationService]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
