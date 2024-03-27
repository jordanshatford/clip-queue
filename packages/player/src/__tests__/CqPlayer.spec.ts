import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ClipPlayer from '../CqPlayer.vue'

describe('CqPlayer.vue', () => {
  const wrapper = shallowMount(ClipPlayer, {
    props: {
      playerFormat: 'unknown',
      title: '',
      source: '',
      thumbnailUrl: ''
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
