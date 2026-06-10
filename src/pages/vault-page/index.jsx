import { useState } from 'react'
import { useVaultContext } from '@/app/providers/VaultContext'
import { useToastContext } from '@/app/providers/ToastContext'
import { lockVaultAction } from '@/features/auth-vault/model'
import { VaultHeader } from '@/widgets/vault-header'
import { SecretList } from '@/widgets/secret-list'
import { Modal } from '@/shared/ui/modal'
import { AddSecretForm } from '@/features/manage-secret/ui/AddSecretForm'

export function VaultPage() {
  const { state, dispatch } = useVaultContext()
  const toast   = useToastContext()
  const [addOpen, setAddOpen] = useState(false)

  function handleLock() {
    lockVaultAction(dispatch)
    toast('Vault locked.', 'info')
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      fontFamily: 'var(--font-sans)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '0 1.25rem 4rem',
    }}>
      {/* Top ambient glow */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 900, height: 280, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at top,rgba(91,156,246,.06) 0%,transparent 70%)',
      }} />

      <div style={{ width: '100%', maxWidth: 980, position: 'relative', zIndex: 1 }}>
        <VaultHeader
          secrets={state.secrets}
          onAddSecret={() => setAddOpen(true)}
          onLock={handleLock}
        />

        <main style={{ paddingTop: '1.75rem' }}>
          <SecretList secrets={state.secrets} onAddSecret={() => setAddOpen(true)} />
        </main>

        {/* Security footer */}
        <footer style={{ marginTop: '3.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 12 }}>
            Security
          </p>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              ['AES-256-GCM',        'Authenticated encryption'],
              ['PBKDF2 SHA-256',     'Key derivation'],
              ['310k iterations',    'Brute-force resistance'],
              ['Non-extractable key','Memory-only, never stored'],
              ['Auto-clear clipboard','After 8 seconds'],
            ].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)' }}>{val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </footer>
      </div>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="New secret">
        <AddSecretForm onClose={() => setAddOpen(false)} />
      </Modal>
    </div>
  )
}
