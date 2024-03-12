import { describe, it, expect } from 'vitest'
import { getAllURLsFromText } from '..'

describe('index.ts', () => {
  it.each([
    ['', []],
    ['https://next.vue-test-utils.vuejs.org/', ['https://next.vue-test-utils.vuejs.org/']],
    ['Some test message with a url https://www.twitch.tv/', ['https://www.twitch.tv/']],
    ['Some test message with a url https://www.x.y/ then text after.', ['https://www.x.y/']],
    [
      'Here are some URLs: https://example.com http://another-example.com?v=2121314&dasdbasbd=123 , and https://yet-another-example.com',
      [
        'https://example.com',
        'http://another-example.com?v=2121314&dasdbasbd=123',
        'https://yet-another-example.com'
      ]
    ]
  ])('gets a url from a message when possible', (input: string, expected: string[]) => {
    expect(getAllURLsFromText(input)).toEqual(expected)
  })
})
