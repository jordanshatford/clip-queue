import { vi } from 'vitest'

// Fix issue with pinia testing
// @ts-expect-error no-undef
globalThis.jest = vi
