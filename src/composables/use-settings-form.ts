import type { Ref } from 'vue'

import { useToast } from 'primevue/usetoast'
import { ref, toRaw, useTemplateRef } from 'vue'

import { m } from '@/paraglide/messages'

/**
 * Reusable composable to handle interaction with settings form. This handles
 * the submitting and resetting functionality.
 * @param element - The ID of the form element being used.
 * @param getter - A getter for the value used in the form.
 * @param setter - A setter for the value used in the form.
 * @param saveSuccessMessage - A success message to use when saving.
 */
export function useSettingsForm<T>(
  element: string,
  getter: () => T,
  setter: (value: T) => void,
  saveSuccessMessage: string,
) {
  const toast = useToast()

  const formElement = useTemplateRef<HTMLFormElement>(element)
  const formSettings: Ref<T> = ref(structuredClone(toRaw(getter()))) as Ref<T>

  function onReset(): void {
    formSettings.value = structuredClone(toRaw(getter()))
    formElement.value?.reset()
  }

  function onSubmit(): void {
    setter(formSettings.value)
    toast.add({
      severity: 'success',
      summary: m.success(),
      detail: saveSuccessMessage,
      life: 3000,
    })
    onReset()
  }

  return {
    formElement,
    formSettings,
    onReset,
    onSubmit,
  }
}
