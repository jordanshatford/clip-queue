<template>
  <Transition name="fade">
    <div v-show="isShown" class="fixed inset-0 z-50 overflow-y-auto" role="dialog">
      <div
        class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 cursor-pointer bg-zinc-800 bg-opacity-90"
          aria-hidden="true"
          @click="resolve(null)"
        />
        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block transform overflow-hidden rounded-xl bg-white text-left align-bottom shadow-xl dark:bg-zinc-900 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
        >
          <div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  class="whitespace-pre-wrap text-lg font-medium leading-6 text-zinc-900 dark:text-white"
                  id="modal-title"
                >
                  {{ options.title }}
                </h3>
                <div class="mt-2 w-full whitespace-pre-wrap text-sm text-zinc-500">
                  {{ options.description }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap px-4 py-3 sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              @click="resolve(true)"
              class="inline-flex w-full justify-center rounded-xl border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ options.confirmText ?? 'Confirm' }}
            </button>
            <button
              type="button"
              @click="resolve(false)"
              class="mt-3 inline-flex w-full justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-base font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-700 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
            >
              {{ options.cancelText ?? 'Cancel' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ConfirmOptions, ConfirmResult } from './types'

export interface Props {
  options: ConfirmOptions
  resolve: (isConfirmed: ConfirmResult) => void
}

defineProps<Props>()

const isShown = ref<boolean>(false)

onMounted(() => {
  isShown.value = true
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
