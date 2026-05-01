import type { ToastMessageOptions } from 'primevue'

import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useSettingsForm } from '@/composables/use-settings-form'

// Mock the reset functionality for the form element from the template ref.
const formResetMock = vi.fn<() => void | undefined>()
vi.mock('vue', async () => {
  return {
    ...(await vi.importActual<typeof import('vue')>('vue')),
    useTemplateRef: () => ({
      value: {
        reset: formResetMock,
      },
    }),
  }
})

// Mock the toast add functionality for PrimeVue toast.
const toastAddMock = vi.fn<(o: ToastMessageOptions) => void>(() => {})
vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: toastAddMock,
  }),
}))

describe('composables/use-settings-form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes formSettings with cloned value from the getter', () => {
    const initial = { foo: 'bar' }
    const { formSettings } = useSettingsForm('form', () => initial, vi.fn(), 'Saved!')
    expect(formSettings.value).toEqual(initial)
    expect(formSettings.value).not.toBe(initial)
  })

  it('can reset formSettings and calls form.reset()', () => {
    const initial = { foo: 'bar' }
    const getter = vi.fn<() => typeof initial>(() => initial)

    const { formSettings, onReset } = useSettingsForm('form', getter, vi.fn(), 'Saved!')

    formSettings.value.foo = 'changed'
    onReset()

    expect(getter).toHaveBeenCalled()
    expect(formSettings.value).toEqual(initial)
    expect(formResetMock).toHaveBeenCalled()
  })

  it('calls setter, shows toast, and resets form when submitting', () => {
    const initial = { foo: 'bar' }
    const setter = vi.fn<(v: typeof initial) => void>()

    const { formSettings, onSubmit } = useSettingsForm('form', () => initial, setter, 'Saved!')
    formSettings.value = { foo: 'updated' }

    onSubmit()

    expect(setter).toHaveBeenCalledWith({ foo: 'updated' })

    expect(toastAddMock).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Saved!',
      life: 3000,
    })

    expect(formResetMock).toHaveBeenCalled()
    expect(formSettings.value).toEqual(initial)
  })

  it('does not throw when calling reset if formElement is undefined', () => {
    const { onReset } = useSettingsForm('form', () => ({ foo: 'bar' }), vi.fn(), 'Saved!')
    expect(() => onReset()).not.toThrow()
  })
})
