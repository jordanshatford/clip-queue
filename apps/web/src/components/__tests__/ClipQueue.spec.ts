import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ClipQueue from '../ClipQueue.vue'

describe('ClipQueue.vue', () => {
  const wrapper = shallowMount(ClipQueue, {
    props: {
      clips: []
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
