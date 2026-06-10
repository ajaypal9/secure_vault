const TOAST_STYLES = {
  success: { bg: 'var(--success-dim)', color: 'var(--success)', border: 'rgba(52,211,153,.3)' },
  error:   { bg: 'var(--danger-dim)',  color: 'var(--danger)',  border: 'rgba(248,113,113,.3)' },
  warning: { bg: 'rgba(251,191,36,.1)',color: 'var(--warning)', border: 'rgba(251,191,36,.3)' },
  info:    { bg: 'var(--accent-dim)',  color: 'var(--accent)',  border: 'var(--accent-ring)' },
}
const ICON = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }

export function ToastList({ toasts }) {
  if (!toasts.length) return null
  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: 8, zIndex: 200,
    }} aria-live="polite">
      {toasts.map((t) => {
        const s = TOAST_STYLES[t.variant]
        return (
          <div key={t.id} role="status" style={{
            display: 'flex', alignItems: 'flex-start', gap: 9,
            padding: '11px 15px', borderRadius: 10, fontSize: 13, fontWeight: 500,
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
            minWidth: 230, maxWidth: 340, animation: 'sv-slideIn .2s ease',
            boxShadow: '0 8px 24px rgba(0,0,0,.35)',
          }}>
            <span style={{ flexShrink: 0, fontSize: 13 }}>{ICON[t.variant]}</span>
            <span style={{ lineHeight: 1.45 }}>{t.message}</span>
          </div>
        )
      })}
    </div>
  )
}
