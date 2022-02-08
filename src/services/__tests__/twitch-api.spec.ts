import type { MockedObject } from "vitest"
import axios from "axios"
import TwitchAPI from "@/services/twitch-api"
import type { TwitchClip, TwitchGame } from "@/interfaces/twitch"

vi.mock("axios")
const mockedAxios = axios as MockedObject<typeof axios>

describe.skip("twitch-api.ts", () => {
  const testClip = {
    id: "testid",
    game_id: "testgame",
    title: "Test title",
    broadcaster_name: "testbroadcast",
    created_at: "",
    thumbnail_url: "",
    url: "https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j",
  } as TwitchClip

  const testGame = { id: "gameid", name: "Test Game" } as TwitchGame

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("gets a twitch clip from twitch api", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { data: [testClip] },
    })
    const clipInfo = await TwitchAPI.getClip(testClip.id)
    expect(clipInfo.id).toEqual(testClip.id)
    expect(clipInfo.title).toEqual(testClip.title)
    expect(clipInfo.broadcaster_name).toEqual(testClip.broadcaster_name)
    expect(axios.get).toHaveBeenCalledTimes(1)
  })

  it("gets a twitch clip from memory if it has already fetched before", async () => {
    // state is stored from previous test, but mock is reset
    const clipInfoSameClip = await TwitchAPI.getClip(testClip.id)
    expect(clipInfoSameClip.id).toEqual(testClip.id)
    expect(clipInfoSameClip.title).toEqual(testClip.title)
    expect(clipInfoSameClip.broadcaster_name).toEqual(testClip.broadcaster_name)
    expect(axios.get).toHaveBeenCalledTimes(0)
  })

  it("gets a twitch game from twitch api", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { data: [testGame] },
    })
    const gameInfo = await TwitchAPI.getGame(testGame.id)
    expect(gameInfo.id).toEqual(testGame.id)
    expect(gameInfo.name).toEqual(testGame.name)
    expect(axios.get).toHaveBeenCalledTimes(1)
  })

  it("gets a twitch game from memory if it has already fetched before", async () => {
    // state is stored from previous test, but mock is reset
    const gameInfo = await TwitchAPI.getGame(testGame.id)
    expect(gameInfo.id).toEqual(testGame.id)
    expect(gameInfo.name).toEqual(testGame.name)
    expect(axios.get).toHaveBeenCalledTimes(0)
  })
})
