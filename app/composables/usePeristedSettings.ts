import { useStorage } from '@vueuse/core'

/**
 * Check if two objects are deeply equal.
 * @param a - The first object.
 * @param b - The second object.
 * @returns True if the objects are deeply equal, false otherwise.
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true
  }

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false
    }
    return a.every((v, i) => deepEqual(v, b[i]))
  }

  const aObj = a as Record<string, unknown>
  const bObj = b as Record<string, unknown>

  const aKeys = Object.keys(aObj)
  const bKeys = Object.keys(bObj)

  if (aKeys.length !== bKeys.length) {
    return false
  }

  return aKeys.every((key) => {
    return Object.hasOwn(bObj, key) && deepEqual(aObj[key], bObj[key])
  })
}

/**
 * Composable for handling use of settings for the application. These settings are persisted for the user.
 * @param id - The ID of the store using the settings.
 * @param defaults - The default value for the settings.
 */
export function usePeristedSettings<T extends object>(id: string, defaults: T) {
  /**
   * The current state of the settings. We currently use localstorage and store is as a unique key.
   * The ID should match that of the pinia store so `test` pinia store would use `__cq_test_settings`
   * as the localstorage key.
   */
  const state = useStorage<T>(`__cq_${id}_settings`, structuredClone(defaults), undefined, {
    mergeDefaults: true,
  })

  /**
   * If the settings have been modified.
   */
  const isModified = computed<boolean>(() => {
    return !deepEqual(state.value, defaults)
  })

  /**
   * Reset the settings back to defaults.
   */
  function reset(): void {
    state.value = structuredClone(defaults)
  }

  return {
    state,
    isModified,
    reset,
  }
}
