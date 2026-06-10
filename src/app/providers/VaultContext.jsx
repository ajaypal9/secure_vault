import { createContext, useContext, useReducer } from 'react'
import { vaultReducer, INITIAL_VAULT_STATE } from '@/entities/vault/model'

const StateCtx    = createContext(null)
const DispatchCtx = createContext(null)

export function VaultProvider({ children }) {
  const [state, dispatch] = useReducer(vaultReducer, INITIAL_VAULT_STATE)
  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>
        {children}
      </DispatchCtx.Provider>
    </StateCtx.Provider>
  )
}

export function useVaultContext() {
  const state    = useContext(StateCtx)
  const dispatch = useContext(DispatchCtx)
  if (!state || !dispatch) throw new Error('useVaultContext must be inside <VaultProvider>')
  return { state, dispatch }
}
