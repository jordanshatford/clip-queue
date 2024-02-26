import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ClipPlayer from '../ClipPlayer.vue'

describe('ClipPlayer.vue', () => {
  const wrapper = shallowMount(ClipPlayer, {
    props: {
      clip: {
        id: 'test',
        title: 'Test title',
        channel: 'testchannel',
        game: 'testgame',
        timestamp: new Date('December 17, 1995 03:24:00').toISOString(),
        url: 'https://www.twitch.tv/test',
        thumbnailUrl: 'test'
      }
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it('successfully shows the time ago for the clip', async () => {
    // @ts-ignore
    expect(wrapper.vm.timeAgo).not.toEqual('')
  })

  it('returns no time ago when it doesnt have a clip timestamp', async () => {
    wrapper.setProps({ clip: {} })
    await wrapper.vm.$nextTick()
    // @ts-ignore
    expect(wrapper.vm.timeAgo).toEqual('')
  })

  it('can use VideoJSPlayer component', async () => {
    wrapper.setProps({ type: 'video' })
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toEqual(true)
  })

  it('can handle unknown type', async () => {
    // @ts-ignore
    wrapper.setProps({ type: 'test' })
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toEqual(true)
  })
})
