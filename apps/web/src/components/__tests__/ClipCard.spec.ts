import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { clipFromTwitch } from '@/__tests__/mocks'
import ClipCard from '../ClipCard.vue'

describe('ClipCard.vue', () => {
  const wrapper = shallowMount(ClipCard, {
    props: {
      clip: clipFromTwitch
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
