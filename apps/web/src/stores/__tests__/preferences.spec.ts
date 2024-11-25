import { createPinia, setActivePinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'

import { getInferredDefaultLanguage, getInferredDefaultTheme, usePreferences } from '../preferences'

const VALUE_LIGHT = '{"preferences": {"theme": "light"}}'
const VALUE_DARK = '{"preferences": {"theme": "dark"}}'

describe('preferences.ts', () => {
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
    expect(getInferredDefaultTheme('light')).toEqual('dark')
    // Dark match media returns false
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query
      }))
    })
    expect(getInferredDefaultTheme('dark')).toEqual('light')
    // Match media is undefined (default to fallback)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined
    })
    expect(getInferredDefaultTheme('dark')).toEqual('dark')
    expect(getInferredDefaultTheme('light')).toEqual('light')
  })

  it('gets the inferred default language when no language was set', () => {
    // en
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        language: 'en'
      }))
    })
    expect(getInferredDefaultLanguage('en')).toEqual('en')
    // en-US
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        language: 'en-US'
      }))
    })
    expect(getInferredDefaultLanguage('en')).toEqual('en')
    // Match media is undefined (default to fallback)
    Object.defineProperty(window, 'navigator', {})
    expect(getInferredDefaultLanguage('en')).toEqual('en')
  })

  it('gets the default value from localstorage if possible (light)', () => {
    localStorage.setItem('cq-preferences', VALUE_LIGHT)
    const preferences = usePreferences()
    expect(preferences.preferences.theme).toEqual('light')
    expect(preferences.isDark).toEqual(false)
    expect(document?.querySelector('html')?.classList.contains('app-dark')).toEqual(false)
  })

  it('gets the default value from localstorage if possible (dark)', () => {
    localStorage.setItem('cq-preferences', VALUE_DARK)
    const preferences = usePreferences()
    expect(preferences.preferences.theme).toEqual('dark')
    expect(preferences.isDark).toEqual(true)
    expect(document?.querySelector('html')?.classList.contains('app-dark')).toEqual(true)
  })

  it('gets the default value from config when no value is in local storage', () => {
    const preferences = usePreferences()
    expect(preferences.preferences.theme).toEqual('dark')
    expect(preferences.isDark).toEqual(true)
  })

  it('can toggle the theme', () => {
    const preferences = usePreferences()
    expect(preferences.preferences.theme).toEqual('dark')
    expect(preferences.isDark).toEqual(true)
    expect(document?.querySelector('html')?.classList.contains('app-dark')).toBeTruthy()
    preferences.toggleTheme()
    expect(preferences.preferences.theme).toEqual('light')
    expect(preferences.isDark).toEqual(false)
    expect(document?.querySelector('html')?.classList.contains('app-dark')).toBeFalsy()
    preferences.toggleTheme()
    expect(preferences.preferences.theme).toEqual('dark')
    expect(preferences.isDark).toEqual(true)
    expect(document?.querySelector('html')?.classList.contains('app-dark')).toBeTruthy()
  })
})
