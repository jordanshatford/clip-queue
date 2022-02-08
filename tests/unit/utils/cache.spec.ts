import { beforeEach, describe, it, expect, vi } from "vitest"
import { cache } from "@/utils/cache"
import config from "@/assets/config"
import type { TwitchClip, TwitchGame } from "@/interfaces/twitch"

const { gamesKey, clipsKey } = config.App.Cache

describe("cache.ts", () => {
  const testGame = { id: "testgame", name: "Test Game" } as TwitchGame

  const testClip = {
    id: "testclip",
    game_id: "testgame",
    title: "Test title",
    broadcaster_name: "testbroadcast",
    created_at: "",
    thumbnail_url: "",
    url: "https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j",
  } as TwitchClip

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("inits when values are already in localstorage", () => {
    localStorage.setItem(gamesKey, JSON.stringify({ [testGame.id]: testGame }))
    localStorage.setItem(clipsKey, JSON.stringify({ [testClip.id]: testClip }))
    cache.init()
    expect(cache.getClip(testClip.id).title).toEqual("Test title")
    expect(cache.getGame(testGame.id).name).toEqual("Test Game")
  })

  it("adds a games to cache which updates localstorage", () => {
    cache.addGame(testGame)
    expect(cache.getGame(testGame.id)).toEqual(testGame)
  })

  it("adds a clip to cache which updates localstorage", () => {
    cache.addClip(testClip)
    expect(cache.getClip(testClip.id)).toEqual(testClip)
  })

  it("gets a game from memory", () => {
    cache.addGame(testGame)
    expect(cache.getGame(testGame.id)).toEqual(testGame)
  })

  it("gets a clip from cache", () => {
    cache.addClip(testClip)
    expect(cache.getClip(testClip.id)).toEqual(testClip)
  })

  it("gets undefined when a game doesnt exist in cache", () => {
    cache.addGame(testGame)
    expect(cache.getGame("not-exists")).toEqual(undefined)
  })

  it("gets undefined when a clip doesnt exist in cache", () => {
    cache.addClip(testClip)
    expect(cache.getClip("not-exists")).toEqual(undefined)
  })
})
