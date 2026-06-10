import { useState, useRef, useEffect } from 'react'
import { FieldRow } from '@/shared/ui/field-row'
import { Button } from '@/shared/ui/button'

export function SecretCard({ secret, onDelete, onCopy }) {
  const [copied,        setCopied]        = useState(null)
  const [showNotes,     setShowNotes]     = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting,      setDeleting]      = useState(false)
  const [hovered,       setHovered]       = useState(false)
  const [secondsLeft,   setSecondsLeft]   = useState(8)
  const countdownInterval = useRef(null)

  useEffect(() => {
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current)
    }
  }, [])

  async function handleCopy(text, id, label) {
    await onCopy(text, label)
    if (countdownInterval.current) clearInterval(countdownInterval.current)
    setCopied(id)
    setSecondsLeft(8)
    countdownInterval.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current)
          setCopied(null)
          return 8
        }
        return prev - 1
      })
    }, 1000)
  }

  async function handleDelete() {
    setDeleting(true)
    await onDelete(secret.id)
    setDeleting(false)
  }

  const hue = secret.colorHue

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? 'linear-gradient(160deg,#1e2d45 0%,#19253a 100%)'
          : 'linear-gradient(160deg,#192236 0%,#151e30 100%)',
        border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        borderRadius: 'var(--r-lg)', padding: '1.15rem 1.2rem',
        display: 'flex', flexDirection: 'column', gap: '0.7rem',
        transition: 'border-color .18s, background .18s, box-shadow .18s',
        boxShadow: hovered ? '0 8px 28px rgba(0,0,0,.35)' : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top shimmer per card — hue from name */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg,transparent,hsla(${hue},70%,65%,.45),transparent)`,
        opacity: hovered ? 1 : 0.4, transition: 'opacity .2s',
      }} />

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Colored avatar */}
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg,hsl(${hue},55%,32%),hsl(${hue},55%,20%))`,
            border: `1px solid hsl(${hue},55%,28%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700, color: `hsl(${hue},75%,75%)`,
            boxShadow: `0 0 10px hsla(${hue},60%,40%,.25)`,
          }}>
            {secret.name[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.25 }}>
              {secret.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>
              {secret.username}
            </div>
          </div>
        </div>

        {/* Delete */}
        {!confirmDelete ? (
          <Button variant="icon" size="xs" onClick={() => setConfirmDelete(true)} aria-label={`Delete ${secret.name}`}>
            <TrashIcon />
          </Button>
        ) : (
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <Button variant="danger" size="xs" loading={deleting} onClick={handleDelete}>Confirm</Button>
            <Button variant="ghost"  size="xs" onClick={() => setConfirmDelete(false)}>Cancel</Button>
          </div>
        )}
      </div>

      {/* ── Username ── */}
      <FieldRow.Root>
        <FieldRow.Content label="Username" value={secret.username} />
        <FieldRow.Actions>
          <CopyBtn copied={copied === `u-${secret.id}`} onClick={() => handleCopy(secret.username, `u-${secret.id}`, 'Username')} />
        </FieldRow.Actions>
      </FieldRow.Root>

      {/* ── Password ── */}
      <FieldRow.Root>
        <FieldRow.Content label="Password" value={secret.password} masked />
        <FieldRow.Actions>
          <CopyBtn copied={copied === `p-${secret.id}`} onClick={() => handleCopy(secret.password, `p-${secret.id}`, 'Password')} />
        </FieldRow.Actions>
      </FieldRow.Root>

      {/* ── Notes ── */}
      {secret.notes && (
        <div>
          <button onClick={() => setShowNotes((s) => !s)} style={{
            display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
            color: 'var(--text-4)', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: 'inherit', padding: 0, transition: 'color .12s',
          }}>
            <NoteIcon /> {showNotes ? 'Hide notes' : 'Show notes'}
          </button>
          {showNotes && (
            <pre style={{
              marginTop: 8, background: 'var(--surface-2)',
              border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
              padding: '9px 12px', fontSize: 13, fontFamily: 'var(--font-mono)',
              color: 'var(--text-2)', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              maxHeight: 110, overflowY: 'auto', animation: 'sv-fadeIn .15s ease',
            }}>
              {secret.notes}
            </pre>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        borderTop: '1px solid var(--border)', paddingTop: 9,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <time style={{ fontSize: 11, color: 'var(--text-4)' }}>
          {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(secret.createdAt))}
        </time>
        {copied && (copied === `u-${secret.id}` || copied === `p-${secret.id}`) && (
          <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 500 }}>
            Copied · clears in {secondsLeft}s
          </span>
        )}
      </div>
    </article>
  )
}

function CopyBtn({ copied, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} title={copied ? 'Copied!' : 'Copy'}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'var(--surface-3)' : 'none', border: 'none', cursor: 'pointer',
        color: copied ? 'var(--success)' : hov ? 'var(--text-2)' : 'var(--text-3)',
        padding: '4px 6px', borderRadius: 6, display: 'flex', transition: 'all .12s',
      }}>
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  )
}

const CopyIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
const NoteIcon  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
