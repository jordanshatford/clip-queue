<template>
  <div class="flex items-center gap-2">
    <span class="h-4 w-4 rounded-full" :class="color.class" />
    <div>{{ color.text() }}</div>
  </div>
</template>

<script setup lang="ts">
import { m } from '#paraglide/messages'

export interface Props {
  name: PrimaryColorName | NeutralColorName
}

const { name } = defineProps<Props>()

const lookup: Record<PrimaryColorName | NeutralColorName, { class: string; text: () => string }> = {
  amber: { class: 'bg-amber-500', text: m.amber },
  blue: { class: 'bg-blue-500', text: m.blue },
  cyan: { class: 'bg-cyan-500', text: m.cyan },
  emerald: { class: 'bg-emerald-500', text: m.emerald },
  fuchsia: { class: 'bg-fuchsia-500', text: m.fuchsia },
  gray: { class: 'bg-gray-500', text: m.gray },
  green: { class: 'bg-green-500', text: m.green },
  indigo: { class: 'bg-indigo-500', text: m.indigo },
  lime: { class: 'bg-lime-500', text: m.lime },
  mauve: { class: 'bg-mauve-500', text: m.mauve },
  mist: { class: 'bg-mist-500', text: m.mist },
  neutral: { class: 'bg-neutral-500', text: m.neutral },
  olive: { class: 'bg-olive-500', text: m.olive },
  orange: { class: 'bg-orange-500', text: m.orange },
  pink: { class: 'bg-pink-500', text: m.pink },
  purple: { class: 'bg-purple-500', text: m.purple },
  red: { class: 'bg-red-500', text: m.red },
  rose: { class: 'bg-rose-500', text: m.rose },
  slate: { class: 'bg-slate-500', text: m.slate },
  stone: { class: 'bg-stone-500', text: m.stone },
  sky: { class: 'bg-sky-500', text: m.sky },
  taupe: { class: 'bg-taupe-500', text: m.taupe },
  teal: { class: 'bg-teal-500', text: m.teal },
  violet: { class: 'bg-violet-500', text: m.violet },
  yellow: { class: 'bg-yellow-500', text: m.yellow },
  zinc: { class: 'bg-zinc-500', text: m.zinc },
}

const color = computed(() => lookup[name])
</script>
