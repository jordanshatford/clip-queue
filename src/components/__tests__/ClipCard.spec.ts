import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ClipCard from '../ClipCard.vue'
import { ClipProvider } from '@/interfaces/clips'

describe('ClipCard.vue', () => {
  const wrapper = shallowMount(ClipCard, {
    props: {
      clip: {
        id: 'test',
        title: 'Test title',
        channel: 'testchannel',
        game: 'testgame',
        timestamp: new Date('December 17, 1995 03:24:00').toDateString(),
        url: 'https://www.twitch.tv/test',
        thumbnailUrl: 'test',
        provider: ClipProvider.TWITCH
      }
    }
  })

  it('mounts successfully', () => {
    expect(wrapper.exists()).toEqual(true)
  })
})
