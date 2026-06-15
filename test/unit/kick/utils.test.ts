import { describe, expect, it, vi } from 'vitest'

import type { KickChatBadge, KickChatSender } from '../../../shared/kick/utils'

import { isKickURL, isSenderBot, isSenderModerator, sleep } from '../../../shared/kick/utils'

describe('shared/kick/utils', () => {
  it.each([
    [new URL('https://kick.com/test'), true],
    [new URL('https://kick.com/testchannel/clip/testclip'), true],
    [new URL('https://kick.com/'), true],
    [new URL('https://twitch.tv/c/testchannel'), false],
    [new URL('https://google.ca'), false],
  ])('can detect if a url is a kick url: (url: %s) -> %s', (input: URL, expected: boolean) => {
    expect(isKickURL(input)).toEqual(expected)
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
