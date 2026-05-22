<template>
  <iframe
    :src="src"
    :title="title"
    class="h-full w-full"
    allowfullscreen
    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    frameborder="0"
  ></iframe>
</template>

<script setup lang="ts">
export interface Props {
  src: string
  title?: string
}

const { src, title = undefined } = defineProps<Props>()
</script>
