import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import VideoJSPlayer from '../VideoJSPlayer.vue'

describe('VideoJSPlayer.vue', () => {
  const wrapper = shallowMount(VideoJSPlayer, {
    props: {
      title: '',
      poster: '',
      source: ''
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
