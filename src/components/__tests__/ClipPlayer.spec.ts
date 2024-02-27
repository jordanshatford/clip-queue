import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ClipPlayer from '../ClipPlayer.vue'
import { ClipProvider, type Clip } from '@/interfaces/clips'

describe('ClipPlayer.vue', () => {
  const CLIP: Clip = {
    id: 'test',
    title: 'Test title',
    channel: 'testchannel',
    game: 'testgame',
    timestamp: new Date('December 17, 1995 03:24:00').toISOString(),
    url: 'https://www.twitch.tv/test',
    thumbnailUrl: 'test',
    provider: ClipProvider.TWITCH
  }

  const wrapper = shallowMount(ClipPlayer, {
    props: {
      clip: CLIP
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
    wrapper.setProps({ clip: { ...CLIP, provider: ClipProvider.KICK } })
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toEqual(true)
  })

  it('can handle unknown type', async () => {
    wrapper.setProps({ clip: { ...CLIP, provider: ClipProvider.UNKNOWN } })
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toEqual(true)
  })
})
