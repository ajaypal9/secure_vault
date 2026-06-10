import { useState, useMemo } from 'react'
import { filterSecrets } from '@/entities/secret/model'
import { SecretCard } from '@/entities/secret/ui/SecretCard'
import { deleteSecretAction } from '@/features/auth-vault/model'
import { clipboardService } from '@/shared/lib/clipboard'
import { useVaultContext } from '@/app/providers/VaultContext'
import { useToastContext } from '@/app/providers/ToastContext'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

export function SecretList({ secrets, onAddSecret }) {
  const { state, dispatch } = useVaultContext()
  const toast  = useToastContext()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => filterSecrets(secrets, query), [secrets, query])

  async function handleDelete(id) {
    if (!state.cryptoKey) return
    const result = await deleteSecretAction(id, state.secrets, state.cryptoKey, dispatch)
    if (result.ok)  toast('Secret deleted.', 'success')
    else            toast(result.error.message, 'error')
  }

  async function handleCopy(text, label) {
    const result = await clipboardService.write(text)
    if (result.ok)  toast(`${label} copied — clears in 8s`, 'info')
    else            toast('Clipboard access denied.', 'error')
  }

  if (secrets.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: 'var(--accent-dim)', border: '1px solid var(--accent-ring)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
        }}>🔐</div>
        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-2)', margin: 0 }}>Your vault is empty</p>
        <p style={{ fontSize: 14, color: 'var(--text-4)', margin: 0 }}>Add your first secret to get started.</p>
        <Button variant="primary" size="sm" onClick={onAddSecret} style={{ marginTop: 6 }}>
          + Add your first secret
        </Button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Search */}
      <div style={{ maxWidth: 380 }}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${secrets.length} secret${secrets.length !== 1 ? 's' : ''}…`}
          leftSlot={<SearchIcon />}
        />
        {query && (
          <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 6 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--text-4)', padding: '1rem 0' }}>
          No secrets match "{query}"
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
        }}>
          {filtered.map((s) => (
            <SecretCard key={s.id} secret={s} onDelete={handleDelete} onCopy={handleCopy} />
          ))}
        </div>
      )}
    </div>
  )
}

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
