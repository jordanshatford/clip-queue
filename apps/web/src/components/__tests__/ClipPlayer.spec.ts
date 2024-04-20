import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { clipFromTwitch, clipFromKick } from '@/__tests__/mocks'
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

  it('can use VideoJSPlayer component', async () => {
    wrapper.setProps({ clip: clipFromKick })
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toEqual(true)
  })
})
