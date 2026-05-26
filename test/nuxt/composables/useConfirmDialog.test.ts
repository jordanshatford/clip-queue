import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import ConfirmDialog, { type ConfirmDialogProps } from '~/components/ConfirmDialog.vue'

const createMock = vi.fn()
const openMock = vi.fn()

mockNuxtImport('useOverlay', () => {
  return () => ({
    create: createMock.mockReturnValue({
      open: openMock,
    }),
  })
})

describe('useConfirmDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates overlay with correct component and props', async () => {
    const confirm = useConfirmDialog()
    const options: ConfirmDialogProps = {
      title: 'Delete item',
      description: 'Are you sure?',
    }
    openMock.mockResolvedValue(true)
    await confirm(options)
    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith(ConfirmDialog, {
      destroyOnClose: true,
      props: options,
    })
  })

  it('returns resolved value from modal.open()', async () => {
    const confirm = useConfirmDialog()
    openMock.mockResolvedValue(true)
    const result = await confirm({
      title: 'Confirm',
      description: 'Proceed?',
    })
    expect(result).toBe(true)
    expect(openMock).toHaveBeenCalledTimes(1)
  })

  it('returns false when modal is rejected', async () => {
    const confirm = useConfirmDialog()
    openMock.mockResolvedValue(false)
    const result = await confirm({
      title: 'Confirm',
      description: 'Proceed?',
    })
    expect(result).toBe(false)
  })
})
