<template>
  <UEmpty
    class="h-full w-full"
    variant="naked"
    :title="m.unsupported_clip()"
    :description="m.unsupported_clip_description()"
  />
</template>

<script setup lang="ts">
import { m } from '#paraglide/messages'
</script>
