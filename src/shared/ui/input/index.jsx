import { useState } from 'react'

export function Input({ label, error, hint, leftSlot, rightSlot, id, style, ...rest }) {
  const [focused, setFocused] = useState(false)
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label htmlFor={inputId} style={{
          fontSize: 12, fontWeight: 600, color: 'var(--text-3)',
          textTransform: 'uppercase', letterSpacing: '.5px',
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftSlot && (
          <span style={{
            position: 'absolute', left: 11, color: 'var(--text-4)',
            display: 'flex', pointerEvents: 'none',
          }}>
            {leftSlot}
          </span>
        )}
        <input
          {...rest}
          id={inputId}
          aria-invalid={!!error}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e) }}
          onBlur={(e)  => { setFocused(false); rest.onBlur?.(e) }}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'var(--surface-2)',
            border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 'var(--r-md)',
            padding: '10px 14px',
            paddingLeft: leftSlot ? 34 : 14,
            paddingRight: rightSlot ? 40 : 14,
            color: 'var(--text-1)', fontSize: 14, fontFamily: 'inherit',
            transition: 'border-color .15s, box-shadow .15s',
            boxShadow: focused
              ? `0 0 0 3px ${error ? 'rgba(248,113,113,.15)' : 'var(--accent-ring)'}`
              : 'none',
            ...style,
          }}
        />
        {rightSlot && (
          <span style={{ position: 'absolute', right: 8, display: 'flex', alignItems: 'center' }}>
            {rightSlot}
          </span>
        )}
      </div>
      {error && (
        <span role="alert" style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 500 }}>
          {error}
        </span>
      )}
      {hint && !error && (
        <span style={{ fontSize: 12, color: 'var(--text-4)' }}>{hint}</span>
      )}
    </div>
  )
}
