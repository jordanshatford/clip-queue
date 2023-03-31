import { describe, it, expect } from 'vitest'
import type { ChatUserstate } from 'tmi.js'
import { isModerator, isClipUrl, getClipIdFromUrl, toURLParams } from '../utils'

describe('utils.ts', () => {
  it.each([
    [{ mod: true } as ChatUserstate, true],
    [{ mod: false } as ChatUserstate, false],
    [{ mod: false, badges: { broadcaster: '1' } } as ChatUserstate, true],
    [{ mod: false, badges: { broadcaster: '0' } } as ChatUserstate, false]
  ])('checks if a user is a moderator', (user: ChatUserstate, expected: boolean) => {
    expect(isModerator(user)).toEqual(expected)
  })

  it.each([
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', false],
    ['', false],
    ['https://clips.twitch.tv/TangibleFreezingPheasantPartyTime-jBBRudZqr_7KehsW', true],
    ['https://m.twitch.tv/clip/RockySteamyWalrusMoreCowbell-ZBrnUiZwQsENj3pi', true]
  ])('checks if link is a clip url', (input: string, expected: boolean) => {
    expect(isClipUrl(input)).toEqual(expected)
  })

  it.each([
    [
      'https://clips.twitch.tv/TangibleFreezingPheasantPartyTime-jBBRudZqr_7KehsW',
      'TangibleFreezingPheasantPartyTime-jBBRudZqr_7KehsW'
    ],
    [
      'https://clips.twitch.tv/RockyDreamyDumplings4Head-FQpZsAzs89ihPF6I',
      'RockyDreamyDumplings4Head-FQpZsAzs89ihPF6I'
    ],
    [
      'https://clips.twitch.tv/FantasticQuaintWrenchPogChamp-seNiJaPPjYls0ID8',
      'FantasticQuaintWrenchPogChamp-seNiJaPPjYls0ID8'
    ],
    ['', undefined]
  ])('gets an id from a clip url', (input: string, expected: string | undefined) => {
    expect(getClipIdFromUrl(input)).toEqual(expected)
  })

  it.each([
    ['id', ['test1', 'test2', 'test3']],
    ['game_id', ['duplicate', 'duplicate', 'duplicate', 'new']],
    ['broadcaster_id', ['user', 'user1', 'user2']]
  ])('gets url search params for values passed (%s, %s)', (key: string, values: string[]) => {
    const p = toURLParams(key, values)
    expect(p.has(key)).toEqual(true)
    expect(p.getAll(key).length).toEqual(values.length)
    expect(p.toString()).toEqual(`${key}=${values.join(`&${key}=`)}`)
  })
})
