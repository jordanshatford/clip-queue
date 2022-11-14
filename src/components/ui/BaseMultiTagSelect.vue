<template>
  <div @keydown.escape="clearInput()">
    <div class="relative" @keydown.enter.prevent="addTag(currentInput)">
      <BaseInput v-model="currentInput" :placeholder="placeholder" />
      <div :class="[dropdownOpen ? 'block' : 'hidden']">
        <div class="absolute z-40 left-0 mt-1 w-full">
          <div class="p-1 rounded-lg text-sm bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700">
            <a
              v-if="!hasTag(currentInput)"
              @click.prevent="addTag(currentInput)"
              class="cq-text block py-1 px-5 cursor-pointer hover:bg-violet-500 hover:text-white"
            >
              add {{ itemName }} "<span class="font-semibold">{{ currentInput }}</span
              >"
            </a>
            <p v-else class="cq-text block py-1 px-5">
              {{ itemName }} "<span class="font-semibold">{{ currentInput }}</span
              >" already added
            </p>
          </div>
        </div>
      </div>
      <div v-if="sortedTags.length > 0" class="space-x-2 space-y-2">
        <BaseTag
          v-for="(tag, index) in sortedTags"
          :class="{ 'mt-2': index === 0 }"
          :key="index"
          dismissable
          @dismiss="removeTag(index)"
          >{{ tag }}
        </BaseTag>
      </div>
      <div v-else class="cq-text-subtle mt-2">No {{ itemName }}s set.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

export interface Props {
  modelValue: string[]
  placeholder?: string
  itemName?: string
}

const props = withDefaults(defineProps<Props>(), { itemName: "tag" })

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void
}>()

const currentInput = ref<string>("")

const dropdownOpen = computed(() => {
  return currentInput.value.trim() !== ""
})

const sortedTags = computed(() => {
  const valueCopy = props.modelValue
  return valueCopy.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
})

function clearInput() {
  currentInput.value = ""
}

function addTag(tag: string) {
  const trimmedTag = tag.trim()
  if (trimmedTag !== "" && !hasTag(trimmedTag)) {
    emit("update:modelValue", [...props.modelValue, trimmedTag])
    clearInput()
  }
}

function hasTag(tag: string) {
  return props.modelValue.some((t) => {
    return t.toLowerCase() === tag.toLowerCase()
  })
}

function removeTag(index: number) {
  const valueCopy = props.modelValue
  valueCopy.splice(index, 1)
  emit("update:modelValue", valueCopy)
}
</script>
