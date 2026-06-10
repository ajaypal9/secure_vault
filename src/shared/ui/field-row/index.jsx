// Compound component: FieldRow.Root > FieldRow.Content + FieldRow.Actions
import { useState } from 'react'

function Root({ children }) {
  return (
    <div style={{
      background: 'var(--surface-2)', borderRadius: 'var(--r-md)',
      padding: '9px 12px', display: 'flex', alignItems: 'center',
      gap: 8, border: '1px solid var(--border)',
    }}>
      {children}
    </div>
  )
}

function Content({ label, value, masked = false }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontSize: 10, textTransform: 'uppercase', letterSpacing: '.6px',
        color: 'var(--text-4)', marginBottom: 3, fontWeight: 600,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 14, color: masked ? 'var(--text-2)' : 'var(--text-2)',
        fontFamily: masked ? 'var(--font-mono)' : 'inherit',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        letterSpacing: masked && !revealed ? 2 : 'normal',
      }}>
        {masked && !revealed ? '••••••••••••' : value}
      </div>
      {masked && (
        <button onClick={() => setRevealed((r) => !r)} style={{
          fontSize: 11, color: 'var(--text-4)', background: 'none', border: 'none',
          cursor: 'pointer', padding: 0, marginTop: 2, fontFamily: 'inherit',
          transition: 'color .12s',
        }}>
          {revealed ? 'hide' : 'reveal'}
        </button>
      )}
    </div>
  )
}

function Actions({ children }) {
  return <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>{children}</div>
}

export const FieldRow = { Root, Content, Actions }
