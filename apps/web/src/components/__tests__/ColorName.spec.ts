import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ColorName from '../ColorName.vue'

describe('ColorName.vue', () => {
  const wrapper = shallowMount(ColorName, {
    props: {
      name: 'amber',
      color: '#FFC107'
    },
    global: {
      plugins: [createTestingPinia()]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
