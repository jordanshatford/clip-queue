import { describe, it, expect } from "vitest"
import { formatTemplateString, getUrlFromMessage, deepEqual } from ".."

describe("index.ts", () => {
  it.each([
    ["", undefined],
    ["https://next.vue-test-utils.vuejs.org/", "https://next.vue-test-utils.vuejs.org/"],
    ["Some test message with a url https://www.twitch.tv/", "https://www.twitch.tv/"],
    ["Some test message with a url https://www.x.y/ then text after.", "https://www.x.y/"],
  ])("gets a url from a message when possible", (input: string, expected: string | undefined) => {
    expect(getUrlFromMessage(input)).toEqual(expected)
  })

  it("formats a template string with values", () => {
    expect(formatTemplateString("this is a {test} {string}", {})).toEqual("this is a {test} {string}")
    expect(formatTemplateString("this is a {test} {string}", { test: "x" })).toEqual("this is a x {string}")
    expect(
      formatTemplateString("this is a {test} {string}", {
        test: "x",
        string: "y",
      })
    ).toEqual("this is a x y")
    expect(formatTemplateString("this is a {test} {string}", { x: "y" })).toEqual("this is a {test} {string}")
    expect(formatTemplateString("this is a {test} {test}", { test: "y" })).toEqual("this is a y y")
  })

  it("checks if two objects are deeply equal to each other", () => {
    const obj = { test: "1213", test2: "abc" }
    expect(deepEqual(obj, obj)).toEqual(true)
    expect(deepEqual(obj, { ...obj, test3: "1" })).toEqual(false)
  })
})
