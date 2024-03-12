import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createApp } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import { useTheme, getInferredDefaultTheme, Theme } from '../theme'

const VALUE_LIGHT = '{"value":"light"}'
const VALUE_DARK = '{"value":"dark"}'

describe('theme.ts', () => {
  const app = createApp({})

  beforeEach(() => {
    const pinia = createPinia().use(piniaPluginPersistedState)
    app.use(pinia)
    setActivePinia(pinia)
  })

  it('gets the inferred default theme when no theme was set', () => {
    // Dark match media returns true
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query
      }))
    })
    expect(getInferredDefaultTheme()).toEqual(Theme.DARK)
    // Dark match media returns false
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query
      }))
    })
    expect(getInferredDefaultTheme()).toEqual(Theme.LIGHT)
    // Match media is undefined (default to dark)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined
    })
    expect(getInferredDefaultTheme()).toEqual(Theme.DARK)
  })

  it('gets the default value from localstorage if possible (light)', () => {
    localStorage.setItem('cq-theme', VALUE_LIGHT)
    const theme = useTheme()
    expect(theme.value).toEqual('light')
    expect(theme.isDark).toEqual(false)
    expect(document?.querySelector('html')?.classList.contains('dark')).toEqual(false)
  })

  it('gets the default value from localstorage if possible (dark)', () => {
    localStorage.setItem('cq-theme', VALUE_DARK)
    const theme = useTheme()
    expect(theme.value).toEqual('dark')
    expect(theme.isDark).toEqual(true)
    expect(document?.querySelector('html')?.classList.contains('dark')).toEqual(true)
  })

  it('gets the default value from config when no value is in local storage', () => {
    const theme = useTheme()
    expect(theme.value).toEqual('dark')
    expect(theme.isDark).toEqual(true)
  })

  it('can toggle the theme', () => {
    const theme = useTheme()
    expect(theme.value).toEqual('dark')
    expect(theme.isDark).toEqual(true)
    expect(document?.querySelector('html')?.classList.contains('dark')).toBeTruthy()
    theme.toggle()
    expect(theme.value).toEqual('light')
    expect(theme.isDark).toEqual(false)
    expect(document?.querySelector('html')?.classList.contains('dark')).toBeFalsy()
    theme.toggle()
    expect(theme.value).toEqual('dark')
    expect(theme.isDark).toEqual(true)
    expect(document?.querySelector('html')?.classList.contains('dark')).toBeTruthy()
  })
})
