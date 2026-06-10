import { ok, err, AppError } from '@/shared/types'

export const localStorageAdapter = {
  get(key) {
    try { return localStorage.getItem(key) } catch { return null }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value)
      return ok(undefined)
    } catch (e) {
      return err(new AppError('STORAGE_WRITE_FAILED', `Cannot write key "${key}"`, e))
    }
  },
  remove(key) {
    try { localStorage.removeItem(key) } catch { /* best-effort */ }
  },
  has(key) {
    try { return localStorage.getItem(key) !== null } catch { return false }
  },
  clear(keys) {
    keys.forEach((k) => this.remove(k))
  },
}
