import { type Plugin, createVNode, render } from 'vue'
import ConfirmComponent from './ConfirmComponent.vue'
import type { ConfirmOptions, ConfirmResult, ConfirmDialog } from './types'

export const plugin: Plugin = {
  install(app) {
    const handler = useConfirm()
    app.provide<ConfirmDialog>('confirm', handler)
  }
}

export default plugin

export function useConfirm() {
  async function handler(options: ConfirmOptions) {
    let node: Node | null = null
    const container = document.createElement('div')
    const response = await new Promise<ConfirmResult>((resolve) => {
      const vm = createVNode(ConfirmComponent, {
        options,
        resolve
      })
      render(vm, container)
      node = container.firstElementChild as Node
      document.body.appendChild(node)
    })
    if (node !== null) {
      document.querySelector('body')?.removeChild(node)
    }
    return response
  }
  return handler
}
