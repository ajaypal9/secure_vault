import { useState } from 'react'
import { useVaultContext } from '@/app/providers/VaultContext'
import { useToastContext } from '@/app/providers/ToastContext'
import { initVaultAction, unlockVaultAction } from '../model'
import { vaultRepository } from '../lib/vaultRepository'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { PASSWORD_MIN_LENGTH } from '@/shared/constants'

export function LockScreen() {
  const { dispatch } = useVaultContext()
  const toast        = useToastContext()
  const isNew        = !vaultRepository.isInitialised()

  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState({})

  function validate() {
    const e = {}
    if (!password)                                    e.password = 'Password is required.'
    else if (isNew && password.length < PASSWORD_MIN_LENGTH) e.password = `Min ${PASSWORD_MIN_LENGTH} characters.`
    if (isNew && password !== confirm)                e.confirm  = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const result = isNew
      ? await initVaultAction(password, dispatch)
      : await unlockVaultAction(password, dispatch)
    setLoading(false)

    if (!result.ok) {
      if (result.error.code === 'WRONG_PASSWORD') setErrors({ password: 'Incorrect master password.' })
      else toast(result.error.message, 'error')
      return
    }
    toast(isNew ? 'Vault created.' : 'Vault unlocked.', 'success')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', fontFamily: 'var(--font-sans)', padding: '1.5rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle,rgba(91,156,246,.08) 0%,transparent 65%)',
      }} />

      <div style={{
        width: '100%', maxWidth: 400, position: 'relative',
        background: 'var(--surface)',
        border: '1px solid var(--border)', borderRadius: 'var(--r-xl)',
        padding: '2.5rem 2rem 2rem',
        boxShadow: '0 24px 64px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.05)',
        display: 'flex', flexDirection: 'column', gap: '1.75rem',
      }}>
        {/* Top accent */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg,transparent,var(--accent-ring),transparent)', borderRadius: 99,
        }} />

        {/* Brand */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', margin: '0 auto 1.1rem',
            background: 'var(--accent-dim)', border: '1px solid var(--accent-ring)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 28px rgba(91,156,246,.15)',
          }}>
            <ShieldIcon />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 8px', letterSpacing: '-.4px' }}>
            Secure Vault
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', margin: 0, lineHeight: 1.6 }}>
            {isNew
              ? 'Create a master password to initialise your vault.'
              : 'Enter your master password to continue.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
          <Input
            label="Master password"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isNew ? 'Choose a strong password' : 'Enter your password'}
            error={errors.password}
            autoFocus
            autoComplete={isNew ? 'new-password' : 'current-password'}
            rightSlot={
              <button type="button" onClick={() => setShowPw((s) => !s)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-3)', display: 'flex', padding: '3px 5px',
              }} aria-label={showPw ? 'Hide' : 'Show'}>
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />
          {isNew && (
            <Input
              label="Confirm password"
              type={showPw ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              error={errors.confirm}
              autoComplete="new-password"
            />
          )}
          <Button
            type="submit" variant="primary" size="md" loading={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
          >
            {isNew ? 'Create vault' : 'Unlock vault'}
          </Button>
        </form>

        {/* Crypto badges */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['AES-256-GCM', 'PBKDF2', '310k iterations'].map((s) => (
            <span key={s} style={{
              fontSize: 11, color: 'var(--text-4)', background: 'var(--surface-2)',
              border: '1px solid var(--border)', borderRadius: 99, padding: '3px 10px',
            }}>{s}</span>
          ))}
        </div>

        {!isNew && (
          <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', margin: 0 }}>
            Forgotten passwords cannot be recovered.
          </p>
        )}
      </div>
    </div>
  )
}

const ShieldIcon  = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const EyeIcon     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOffIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
