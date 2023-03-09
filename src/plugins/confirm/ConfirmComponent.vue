<template>
  <Transition name="fade">
    <div v-show="isShown" class="fixed z-50 inset-0 overflow-y-auto" role="dialog">
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-zinc-800 cursor-pointer bg-opacity-90"
          aria-hidden="true"
          @click="resolve(null)"
        />
        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block align-bottom bg-white dark:bg-zinc-900 rounded-xl text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  class="whitespace-pre-wrap text-lg leading-6 font-medium text-zinc-900 dark:text-white"
                  id="modal-title"
                >
                  {{ options.title }}
                </h3>
                <div class="whitespace-pre-wrap mt-2 w-full text-sm text-zinc-500">
                  {{ options.description }}
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 sm:px-6 flex flex-wrap sm:flex-row-reverse">
            <button
              type="button"
              @click="resolve(true)"
              class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-400 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ options.confirmText ?? 'Confirm' }}
            </button>
            <button
              type="button"
              @click="resolve(false)"
              class="mt-3 w-full inline-flex justify-center rounded-xl border dark:text-white dark:hover:bg-zinc-700 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-sm px-4 py-2 bg-white text-base font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
