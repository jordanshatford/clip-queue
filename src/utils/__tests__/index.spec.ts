import { describe, it, expect } from 'vitest'
import { getUrlFromMessage, deepEqual, clone } from '..'

describe('index.ts', () => {
  it.each([
    ['', undefined],
    ['https://next.vue-test-utils.vuejs.org/', 'https://next.vue-test-utils.vuejs.org/'],
    ['Some test message with a url https://www.twitch.tv/', 'https://www.twitch.tv/'],
    ['Some test message with a url https://www.x.y/ then text after.', 'https://www.x.y/']
  ])('gets a url from a message when possible', (input: string, expected: string | undefined) => {
    expect(getUrlFromMessage(input)).toEqual(expected)
  })

  it('checks if two objects are deeply equal to each other', () => {
    const obj = { test: '1213', test2: 'abc' }
    expect(deepEqual(obj, obj)).toEqual(true)
    expect(deepEqual(obj, { ...obj, test3: '1' })).toEqual(false)
  })

  it('clones an object', () => {
    const obj = { test: '1213', test2: 'abc' }
    expect(clone(obj)).toEqual(obj)
  })
})
