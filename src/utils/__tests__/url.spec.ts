import { getUrlFromMessage } from "@/utils/url"

describe("url.ts", () => {
  it.each([
    ["", undefined],
    ["https://next.vue-test-utils.vuejs.org/", "https://next.vue-test-utils.vuejs.org/"],
    ["Some test message with a url https://www.twitch.tv/", "https://www.twitch.tv/"],
    ["Some test message with a url https://www.x.y/ then text after.", "https://www.x.y/"],
  ])("gets a url from a message when possible", (input: string, expected: string | undefined) => {
    expect(getUrlFromMessage(input)).toEqual(expected)
  })
})
