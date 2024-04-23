import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
