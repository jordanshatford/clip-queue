import { getUrlFromMessage, getIdFromUrl } from "@/utils/url"

describe("url.ts", () => {
  it.each([
    ["", undefined],
    ["https://next.vue-test-utils.vuejs.org/", "https://next.vue-test-utils.vuejs.org/"],
    ["Some test message with a url https://www.twitch.tv/", "https://www.twitch.tv/"],
    ["Some test message with a url https://www.x.y/ then text after.", "https://www.x.y/"],
  ])("gets a url from a message when possible", (input: string, expected: string | undefined) => {
    expect(getUrlFromMessage(input)).toEqual(expected)
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
    expect(getIdFromUrl(input)).toEqual(expected)
  })
})
