import { ToastProvider } from './ToastContext'
import { VaultProvider } from './VaultContext'

export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <VaultProvider>
        {children}
      </VaultProvider>
    </ToastProvider>
  )
}

export { useVaultContext } from './VaultContext'
export { useToastContext } from './ToastContext'
