import ConfirmDialog, { type ConfirmDialogProps } from '@/components/ConfirmDialog.vue'

export const useConfirmDialog = () => {
  // @ts-ignore
  const overlay = useOverlay()
  return (options: ConfirmDialogProps): Promise<boolean> => {
    const modal = overlay.create(ConfirmDialog, {
      destroyOnClose: true,
      props: options,
    })
    return modal.open()
  }
}
