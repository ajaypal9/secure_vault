import { useState } from 'react'

const SIZE = {
  xs: { fontSize: 11, padding: '4px 10px',  gap: 4,  borderRadius: 6 },
  sm: { fontSize: 13, padding: '7px 15px',  gap: 6,  borderRadius: 8 },
  md: { fontSize: 14, padding: '10px 20px', gap: 7,  borderRadius: 9 },
}

export function Button({ variant = 'ghost', size = 'md', loading = false, disabled, children, style, ...rest }) {
  const [hover, setHover] = useState(false)

  const variants = {
    primary: {
      background: hover ? '#4a8de8' : '#5b9cf6',
      color: '#fff',
      border: 'none',
      boxShadow: hover ? '0 0 22px rgba(91,156,246,.4)' : '0 0 0 rgba(91,156,246,0)',
    },
    ghost: {
      background: hover ? 'rgba(255,255,255,.07)' : 'transparent',
      color: hover ? 'var(--text-2)' : 'var(--text-3)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: hover ? 'rgba(248,113,113,.15)' : 'transparent',
      color: 'var(--danger)',
      border: '1px solid rgba(248,113,113,.35)',
    },
    icon: {
      background: hover ? 'var(--surface-3)' : 'transparent',
      color: hover ? 'var(--text-2)' : 'var(--text-3)',
      border: 'none',
      padding: '5px 6px',
      borderRadius: 7,
    },
  }

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      onMouseEnter={(e) => { setHover(true); rest.onMouseEnter?.(e) }}
      onMouseLeave={(e) => { setHover(false); rest.onMouseLeave?.(e) }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'inherit', fontWeight: 600,
        transition: 'all .15s ease', outline: 'none', userSelect: 'none',
        opacity: disabled || loading ? 0.5 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        ...SIZE[size],
        ...variants[variant],
        ...style,
      }}
    >
      {loading && (
        <span style={{
          width: 12, height: 12, border: '2px solid currentColor',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'sv-spin .65s linear infinite', flexShrink: 0,
        }} />
      )}
      {children}
    </button>
  )
}
