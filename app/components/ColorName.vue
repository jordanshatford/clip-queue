<template>
  <div class="flex items-center gap-2">
    <span class="h-4 w-4 rounded-full" :class="colorClasses[name]" />

    <div>{{ colorNameTranslations[name]?.() }}</div>
  </div>
</template>

<script setup lang="ts">
import { m } from '@/paraglide/messages'

export interface Props {
  name: string
}

defineProps<Props>()

const colorNameTranslations: Record<string, () => string> = {
  emerald: m.emerald,
  green: m.green,
  lime: m.lime,
  orange: m.orange,
  amber: m.amber,
  yellow: m.yellow,
  teal: m.teal,
  cyan: m.cyan,
  sky: m.sky,
  blue: m.blue,
  indigo: m.indigo,
  violet: m.violet,
  purple: m.purple,
  fuchsia: m.fuchsia,
  pink: m.pink,
  rose: m.rose,
  slate: m.slate,
  gray: m.gray,
  zinc: m.zinc,
  neutral: m.neutral,
  stone: m.stone,
  soho: m.soho,
  viva: m.viva,
  ocean: m.ocean,
  taupe: m.taupe,
  mauve: m.mauve,
  mist: m.mist,
  olive: m.olive,
}

const colorClasses: Record<string, string> = {
  emerald: 'bg-emerald-500',
  green: 'bg-green-500',
  lime: 'bg-lime-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  yellow: 'bg-yellow-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
  sky: 'bg-sky-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  purple: 'bg-purple-500',
  fuchsia: 'bg-fuchsia-500',
  pink: 'bg-pink-500',
  rose: 'bg-rose-500',
  slate: 'bg-slate-500',
  gray: 'bg-gray-500',
  zinc: 'bg-zinc-500',
  neutral: 'bg-neutral-500',
  stone: 'bg-stone-500',
  soho: 'bg-soho-500',
  viva: 'bg-viva-500',
  ocean: 'bg-ocean-500',
  taupe: 'bg-taupe-500',
  mauve: 'bg-mauve-500',
  mist: 'bg-mist-500',
  olive: 'bg-olive-500',
}
</script>
