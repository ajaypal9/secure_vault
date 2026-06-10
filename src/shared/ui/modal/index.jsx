import { useEffect, useRef } from 'react'
import { Button } from '@/shared/ui/button'

export function Modal({ isOpen, onClose, title, children, maxWidth = 480 }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(5,8,15,.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '1rem', animation: 'sv-fadeIn .15s ease',
      }}
    >
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-xl)',
        padding: '1.75rem', width: '100%', maxWidth,
        display: 'flex', flexDirection: 'column', gap: '1.25rem',
        maxHeight: '92vh', overflowY: 'auto',
        boxShadow: '0 32px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.05)',
        animation: 'sv-slideUp .2s ease', position: 'relative',
      }}>
        {/* accent glow */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg,transparent,var(--accent-ring),transparent)',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 id="modal-title" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-.3px' }}>
            {title}
          </h2>
          <Button variant="icon" size="xs" onClick={onClose} aria-label="Close">
            <XIcon />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}

function XIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
