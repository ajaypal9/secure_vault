import { ok, err, AppError } from '@/shared/types'
import { CLIPBOARD_CLEAR_MS } from '@/shared/constants'

export const clipboardService = {
  async write(text, clearAfterMs = CLIPBOARD_CLEAR_MS) {
    try {
      await navigator.clipboard.writeText(text)
      setTimeout(() => {
        navigator.clipboard.writeText('').catch(() => {})
      }, clearAfterMs)
      return ok(undefined)
    } catch (e) {
      return err(new AppError('CLIPBOARD_DENIED', 'Clipboard write denied.', e))
    }
  },
}
