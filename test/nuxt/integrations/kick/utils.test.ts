import { describe, expect, it, vi } from 'vitest'

import type { KickChatBadge, KickChatSender } from '~/integrations/kick/core/pusher'

import { isKickURL, isSenderBot, isSenderModerator, sleep } from '~/integrations/kick/core/utils'

describe('integrations/kick/core/utils', () => {
  it.each([
    [new URL('https://kick.com/test'), true],
    [new URL('https://kick.com/testchannel/clip/testclip'), true],
    [new URL('https://kick.com/'), true],
    [new URL('https://twitch.tv/c/testchannel'), false],
    [new URL('https://google.ca'), false],
  ])('can detect if a url is a kick url: (url: %s) -> %s', (input: URL, expected: boolean) => {
    expect(isKickURL(input)).toEqual(expected)
  })

  it('has a sleep that resolves after the provided duration', async () => {
    vi.useFakeTimers()
    const callback = vi.fn<() => void>()
    sleep(1000).then(callback)
    expect(callback).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(999)
    expect(callback).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(callback).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('has a sleep that resolves immediately for 0 milliseconds', async () => {
    vi.useFakeTimers()
    const callback = vi.fn<() => void>()
    sleep(0).then(callback)
    await vi.runAllTimersAsync()
    expect(callback).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('has a sleep that returns a Promise<void>', () => {
    const result = sleep(1)
    expect(result).toBeInstanceOf(Promise)
  })

  function createSender(badges: KickChatBadge[] = []): Pick<KickChatSender, 'identity'> {
    return {
      identity: {
        color: '',
        badges,
      },
    }
  }

  it.each([
    [createSender(), false],
    [createSender([{ type: 'moderator', text: '' }]), true],
    [createSender([{ type: 'broadcaster', text: '' }]), true],
    [
      createSender([
        { type: 'broadcaster', text: '' },
        { type: 'moderator', text: '' },
      ]),
      true,
    ],
    [createSender([{ type: 'bot', text: '' }]), false],
    [createSender([{ type: 'other', text: '' }]), false],
  ])(
    'can detect that %s is a moderator is %s',
    (sender: Pick<KickChatSender, 'identity'>, expected: boolean) => {
      expect(isSenderModerator(sender)).toEqual(expected)
    },
  )

  it.each([
    [createSender(), false],
    [createSender([{ type: 'moderator', text: '' }]), false],
    [createSender([{ type: 'broadcaster', text: '' }]), false],
    [
      createSender([
        { type: 'broadcaster', text: '' },
        { type: 'moderator', text: '' },
      ]),
      false,
    ],
    [createSender([{ type: 'bot', text: '' }]), true],
    [createSender([{ type: 'other', text: '' }]), false],
  ])(
    'can detect that %s is a bot is %s',
    (sender: Pick<KickChatSender, 'identity'>, expected: boolean) => {
      expect(isSenderBot(sender)).toEqual(expected)
    },
  )
})
