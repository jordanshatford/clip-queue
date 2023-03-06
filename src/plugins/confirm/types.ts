export interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
}

export type ConfirmResult = boolean | null

export type ConfirmDialog = (options: ConfirmOptions) => Promise<ConfirmResult>
