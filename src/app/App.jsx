import { useVaultContext } from './providers/VaultContext'
import { LockPage }  from '@/pages/lock-page'
import { VaultPage } from '@/pages/vault-page'

export function App() {
  const { state } = useVaultContext()
  return state.status === 'unlocked' ? <VaultPage /> : <LockPage />
}
