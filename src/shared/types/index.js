// ─── Result helpers (JS-friendly) ─────────────────────────────────────────────
export const ok  = (value)  => ({ ok: true,  value })
export const err = (error)  => ({ ok: false, error })

export class AppError extends Error {
  constructor(code, message, cause) {
    super(message)
    this.name  = 'AppError'
    this.code  = code
    this.cause = cause
  }
}
