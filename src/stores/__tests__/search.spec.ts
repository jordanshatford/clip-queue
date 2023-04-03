import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSearch } from '../search'

describe('search.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('is created in a none loading state', () => {
    const search = useSearch()
    expect(search.term).toEqual('')
    expect(search.loading).toEqual(false)
  })
})
