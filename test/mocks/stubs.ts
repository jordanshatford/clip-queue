import type { Component } from 'vue'

export const UTooltipStub: Component = {
  name: 'UTooltip',
  props: ['text'],
  template: `
      <div class="u-tooltip-stub">
        <slot />
        <span v-if="text">{{ text }}</span>
      </div>
    `,
}
