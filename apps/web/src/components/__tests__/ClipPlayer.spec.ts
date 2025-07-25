import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { clipFromKick, clipFromTwitch } from '@/__tests__/mocks'
import ClipPlayer from '../ClipPlayer.vue'

describe('ClipPlayer.vue', () => {
  const wrapper = shallowMount(ClipPlayer, {
    props: {
      clip: clipFromTwitch
    },
    global: {
      plugins: [createTestingPinia()]
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it('mounts successfully when using video.js', async () => {
    wrapper.setProps({ clip: clipFromKick })
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toEqual(true)
  })
})
