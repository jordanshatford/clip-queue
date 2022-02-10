import axios from "axios"
import TwitchAPI from "../api"
import type { TwitchClip, TwitchGame } from "@/services/twitch"

vi.mock("axios", () => {
  return {
    default: {
      get: vi
        .fn()
        .mockResolvedValueOnce({
          data: {
            data: [
              {
                id: "testid",
                game_id: "testgame",
                title: "Test title",
                broadcaster_name: "testbroadcast",
                created_at: "",
                thumbnail_url: "",
                url: "https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j",
                embed_url: "https://clips.twitch.tv/CoyAuspiciousLarkDeIlluminati-2bABUuW_9EbnIv6j",
              } as TwitchClip,
            ],
          },
        })
        .mockResolvedValueOnce({
          data: { data: [{ id: "gameid", name: "Test Game" } as TwitchGame] },
        }),
    },
  }
})

describe("twitch-api.ts", () => {
  it("gets a twitch clip from twitch api", async () => {
    const clipInfo = await TwitchAPI.getClip("testid", "", "")
    expect(clipInfo.id).toEqual("testid")
    expect(clipInfo.title).toEqual("Test title")
    expect(clipInfo.broadcaster_name).toEqual("testbroadcast")
    expect(axios.get).toHaveBeenCalledTimes(1)
  })

  it("gets a twitch game from twitch api", async () => {
    const gameInfo = await TwitchAPI.getGame("gameid", "", "")
    expect(gameInfo.id).toEqual("gameid")
    expect(gameInfo.name).toEqual("Test Game")
    expect(axios.get).toHaveBeenCalledTimes(2)
  })
})
