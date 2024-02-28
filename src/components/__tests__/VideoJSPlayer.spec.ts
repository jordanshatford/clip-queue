import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import VideoJSPlayer from '../VideoJSPlayer.vue'

describe('VideoJSPlayer.vue', () => {
  const wrapper = shallowMount(VideoJSPlayer, {
    props: {
      poster: '',
      source: ''
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
