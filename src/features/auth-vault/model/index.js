import { createSecret } from '@/entities/secret/model'
import { vaultRepository } from '../lib/vaultRepository'

export async function initVaultAction(password, dispatch) {
  const result = await vaultRepository.init(password)
  if (result.ok) dispatch({ type: 'UNLOCK', key: result.value, secrets: [] })
  return result
}

export async function unlockVaultAction(password, dispatch) {
  const result = await vaultRepository.unlock(password)
  if (result.ok) dispatch({ type: 'UNLOCK', key: result.value.key, secrets: result.value.secrets })
  return result
}

export async function addSecretAction(draft, currentSecrets, key, dispatch) {
  const secret = createSecret(draft)
  dispatch({ type: 'ADD_SECRET', secret })                          // optimistic
  const updated = [secret, ...currentSecrets]
  const result  = await vaultRepository.persist(updated, key)
  if (!result.ok) dispatch({ type: 'DELETE_SECRET', id: secret.id }) // rollback
  return result
}

export async function deleteSecretAction(id, currentSecrets, key, dispatch) {
  dispatch({ type: 'DELETE_SECRET', id })                           // optimistic
  const updated  = currentSecrets.filter((s) => s.id !== id)
  const result   = await vaultRepository.persist(updated, key)
  if (!result.ok) {
    const restored = currentSecrets.find((s) => s.id === id)
    if (restored) dispatch({ type: 'ADD_SECRET', secret: restored }) // rollback
  }
  return result
}

export function lockVaultAction(dispatch) {
  dispatch({ type: 'LOCK' })
}
