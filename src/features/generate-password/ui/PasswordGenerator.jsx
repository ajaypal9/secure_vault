import { useState } from 'react'
import { DEFAULT_OPTIONS, generatePassword, calcEntropy, strengthFromEntropy } from '../model'

export function PasswordGenerator({ onSelect }) {
  const [opts,  setOpts]  = useState(DEFAULT_OPTIONS)
  const [value, setValue] = useState(() => generatePassword(DEFAULT_OPTIONS))
  const [hoverRefresh, setHoverRefresh] = useState(false)

  const entropy  = calcEntropy(opts)
  const strength = strengthFromEntropy(entropy)

  function regenerate(nextOpts = opts) { setValue(generatePassword(nextOpts)) }

  function updateOpt(key, val) {
    const next = { ...opts, [key]: val }
    setOpts(next)
    regenerate(next)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Preview */}
      <div style={{
        background: 'var(--surface-3)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)', padding: '10px 13px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <code style={{
          flex: 1, fontFamily: 'var(--font-mono)', fontSize: 13,
          color: '#a5b4fc', wordBreak: 'break-all', lineHeight: 1.5,
        }}>
          {value}
        </code>
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => regenerate()}
            onMouseEnter={() => setHoverRefresh(true)}
            onMouseLeave={() => setHoverRefresh(false)}
            title="Regenerate"
            style={{
              background: hoverRefresh ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.03)',
              border: `1px solid ${hoverRefresh ? 'var(--border-hover)' : 'var(--border)'}`,
              borderRadius: 6,
              cursor: 'pointer',
              color: hoverRefresh ? 'var(--text-1)' : 'var(--text-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 26,
              height: 26,
              transition: 'all .12s ease',
            }}
          >
            <RefreshIcon />
          </button>
          {onSelect && (
            <button onClick={() => onSelect(value)} style={{
              background: 'var(--accent-dim)', border: '1px solid var(--accent-ring)',
              color: 'var(--accent)', fontSize: 12, fontWeight: 600,
              borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit',
            }}>Use</button>
          )}
        </div>
      </div>

      {/* Strength bar */}
      <div>
        <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginBottom: 5 }}>
          <div style={{
            height: '100%', width: `${strength.pct}%`,
            background: strength.color, borderRadius: 99,
            transition: 'width .3s, background .3s',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
          <span style={{ color: 'var(--text-4)' }}>{entropy} bits entropy</span>
        </div>
      </div>

      {/* Length */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-3)', marginBottom: 6 }}>
          <span>Length</span>
          <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{opts.length}</span>
        </div>
        <input type="range" min={8} max={64} step={1} value={opts.length}
          onChange={(e) => updateOpt('length', Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
        />
      </div>

      {/* Charset toggles */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          ['useUppercase', 'A–Z'],
          ['useLowercase', 'a–z'],
          ['useDigits',    '0–9'],
          ['useSymbols',   '!@#'],
        ].map(([key, label]) => (
          <label key={key} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 13, color: 'var(--text-3)', cursor: 'pointer', userSelect: 'none',
          }}>
            <input type="checkbox" checked={opts[key]}
              onChange={(e) => updateOpt(key, e.target.checked)}
              style={{ accentColor: 'var(--accent)', width: 14, height: 14 }}
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  )
}

const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
)
