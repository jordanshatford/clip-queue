<template>
  <div :class="classes.wrapper">
    <table :class="classes.table" cellspacing="0">
      <thead :class="classes.thead">
        <tr :class="classes.headtr">
          <th
            v-for="(column, index) in columns"
            scope="col"
            :key="column.key"
            :class="[classes.th, { 'text-right': isLastColumn(index) }]"
          >
            <slot name="head" :column="column">{{ column.title }}</slot>
          </th>
        </tr>
      </thead>
      <tbody :class="classes.tbody">
        <tr v-for="(row, rIndex) in rows" :key="rIndex" :class="classes.tr">
          <td
            v-for="(column, cIndex) in columns"
            :key="column.key"
            :class="[classes.td, { 'text-right': isLastColumn(cIndex) }]"
          >
            <slot name="cell" :row="row" :column="column" :cell="(row as any)[column.key]">{{
              (row as any)[column.key]
            }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T">
export interface Props<T> {
  columns: { key: string; title: string }[]
  rows: T[]
  classes?: {
    wrapper?: string
    table?: string
    headtr?: string
    thead?: string
    tbody?: string
    tr?: string
    th?: string
    td?: string
  }
}

const props = withDefaults(defineProps<Props<T>>(), {
  classes: () => ({
    wrapper: 'min-w-full border-2 rounded-xl border-zinc-100 dark:border-zinc-800',
    table: 'min-w-full table-auto',
    headtr: 'cq-text text-left uppercase',
    thead: 'bg-zinc-100 dark:bg-zinc-800',
    tbody: 'divide-y divide-zinc-100 dark:divide-zinc-800',
    tr: '',
    th: 'px-3 py-2',
    td: 'p-3'
  })
})

function isLastColumn(index: number) {
  return index === props.columns.length - 1
}
</script>
