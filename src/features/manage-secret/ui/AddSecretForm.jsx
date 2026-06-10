import { useState, useRef, useEffect } from 'react'
import { useVaultContext } from '@/app/providers/VaultContext'
import { useToastContext } from '@/app/providers/ToastContext'
import { addSecretAction } from '@/features/auth-vault/model'
import { PasswordGenerator } from '@/features/generate-password/ui/PasswordGenerator'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

export function AddSecretForm({ onClose }) {
  const { state, dispatch } = useVaultContext()
  const toast  = useToastContext()

  const [form, setForm]     = useState({ name: '', username: '', password: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(true)
  const [showGen, setShowGen] = useState(false)
  const [saving, setSaving]  = useState(false)
  const nameRef = useRef(null)

  useEffect(() => { nameRef.current?.focus() }, [])

  function set(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      setErrors((err) => ({ ...err, [field]: undefined }))
    }
  }

  function validate() {
    const e = {}
    if (!form.name.trim())     e.name     = 'Name is required.'
    if (!form.username.trim()) e.username = 'Username / email is required.'
    if (!form.password.trim()) e.password = 'Password is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    if (!state.cryptoKey) { toast('Vault is locked', 'error'); return }

    setSaving(true)
    const result = await addSecretAction(
      { name: form.name, username: form.username, password: form.password, notes: form.notes || undefined },
      state.secrets,
      state.cryptoKey,
      dispatch
    )
    setSaving(false)

    if (!result.ok) { toast(result.error.message, 'error'); return }
    toast(`"${form.name}" saved.`, 'success')
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
      <Input ref={nameRef}
        label="Name" value={form.name} onChange={set('name')}
        placeholder="GitHub, AWS Console, Gmail…" error={errors.name}
      />
      <Input
        label="Username / Email" value={form.username} onChange={set('username')}
        placeholder="you@example.com" error={errors.username} autoComplete="off"
      />
      <Input
        label="Password"
        type={showPw ? 'text' : 'password'}
        value={form.password} onChange={set('password')}
        placeholder="Enter or generate" error={errors.password}
        autoComplete="new-password"
        style={{ fontFamily: 'var(--font-mono)', letterSpacing: .4 }}
        rightSlot={
          <button type="button" onClick={() => setShowPw((s) => !s)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-3)', display: 'flex', padding: '3px 5px',
          }} aria-label={showPw ? 'Hide password' : 'Show password'}>
            {showPw ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
      />

      {/* Generator */}
      <div>
        <button type="button" onClick={() => setShowGen((s) => !s)} style={{
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
          color: 'var(--accent)', background: 'none', border: 'none',
          cursor: 'pointer', fontFamily: 'inherit', padding: 0,
        }}>
          <KeyIcon /> {showGen ? 'Hide generator' : 'Password generator'}
        </button>
        {showGen && (
          <div style={{
            marginTop: 10, background: 'var(--surface-2)',
            border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '13px',
            animation: 'sv-fadeIn .15s ease',
          }}>
            <PasswordGenerator onSelect={(pw) => { setForm((f) => ({ ...f, password: pw })); setShowGen(false) }} />
          </div>
        )}
      </div>

      {/* Notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
          Notes <span style={{ textTransform: 'none', fontSize: 11, fontWeight: 400, color: 'var(--text-4)' }}>(optional)</span>
        </label>
        <textarea value={form.notes} onChange={set('notes')}
          placeholder="2FA backup codes, recovery keys…" rows={3}
          style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
            padding: '10px 13px', color: 'var(--text-1)', fontSize: 14,
            fontFamily: 'inherit', lineHeight: 1.55,
            width: '100%', boxSizing: 'border-box',
            transition: 'border-color .15s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
          onBlur={(e)  => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary" size="sm" loading={saving}>Save secret</Button>
      </div>
    </form>
  )
}

const EyeIcon     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOffIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
const KeyIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 1.5 1.5M15.5 7.5 14 6"/></svg>
