import type { Userstate } from "tmi.js"
import { isModerator, isClipUrl, getClipIdFromUrl } from "../utils"

describe("utils.ts", () => {
  it.each([
    [{ mod: true } as Userstate, true],
    [{ mod: false } as Userstate, false],
    [{ mod: false, badges: { broadcaster: "1" } } as Userstate, true],
    [{ mod: false, badges: { broadcaster: "0" } } as Userstate, false],
  ])("checks if a user is a moderator", (user: Userstate, expected: boolean) => {
    expect(isModerator(user)).toEqual(expected)
  })

  it.each([
    ["https://developer.mozilla.org/en-US/docs/Web/API/URL/URL", false],
    ["", false],
    ["https://clips.twitch.tv/TangibleFreezingPheasantPartyTime-jBBRudZqr_7KehsW", true],
    ["https://m.twitch.tv/clip/RockySteamyWalrusMoreCowbell-ZBrnUiZwQsENj3pi", true],
  ])("checks if link is a clip url", (input: string, expected: boolean) => {
    expect(isClipUrl(input)).toEqual(expected)
  })

  it.each([
    [
      "https://clips.twitch.tv/TangibleFreezingPheasantPartyTime-jBBRudZqr_7KehsW",
      "TangibleFreezingPheasantPartyTime-jBBRudZqr_7KehsW",
    ],
    [
      "https://clips.twitch.tv/RockyDreamyDumplings4Head-FQpZsAzs89ihPF6I",
      "RockyDreamyDumplings4Head-FQpZsAzs89ihPF6I",
    ],
    [
      "https://clips.twitch.tv/FantasticQuaintWrenchPogChamp-seNiJaPPjYls0ID8",
      "FantasticQuaintWrenchPogChamp-seNiJaPPjYls0ID8",
    ],
  ])("gets an id from a clip url", (input: string, expected: string) => {
    expect(getClipIdFromUrl(input)).toEqual(expected)
  })
})
