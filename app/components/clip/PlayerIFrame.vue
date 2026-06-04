<template>
  <iframe
    :src
    :title
    class="h-full w-full"
    allowfullscreen
    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
  ></iframe>
</template>

<script setup lang="ts">
export interface Props {
  src: string
  title?: string
}

const { src, title = undefined } = defineProps<Props>()
</script>
