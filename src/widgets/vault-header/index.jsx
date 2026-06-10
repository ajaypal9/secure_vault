import { Button } from '@/shared/ui/button'

export function VaultHeader({ secrets, onAddSecret, onLock }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '1rem', padding: '1.5rem 0 1.25rem',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: 'var(--accent-dim)', border: '1px solid var(--accent-ring)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ShieldIcon />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-.3px' }}>
            Secure Vault
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 1 }}>
            {secrets.length} secret{secrets.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="ghost" size="sm" onClick={onLock}>
          <LockIcon /> Lock
        </Button>
        <Button variant="primary" size="sm" onClick={onAddSecret}>
          <PlusIcon /> Add secret
        </Button>
      </div>
    </header>
  )
}

const ShieldIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const LockIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const PlusIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
