import { describe, it, expect } from "vitest"
import { formatTemplateString } from "@/utils/formatter"

describe("formatter.ts", () => {
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
})
