import { ok, err, AppError } from '@/shared/types'
import { generateSalt, deriveKey, encryptJson, decryptJson, bytesToHex, hexToBytes } from '@/shared/lib/crypto'
import { localStorageAdapter } from '@/shared/lib/storage'
import { STORAGE, VAULT_SCHEMA_VERSION } from '@/shared/constants'

// Lightweight payload validation (no Zod needed)
function isValidPayload(p) {
  return (
    p &&
    typeof p === 'object' &&
    p.schemaVersion === VAULT_SCHEMA_VERSION &&
    Array.isArray(p.secrets)
  )
}

class VaultRepositoryImpl {
  #store = localStorageAdapter

  isInitialised() {
    return this.#store.has(STORAGE.SALT_KEY) && this.#store.has(STORAGE.VAULT_KEY)
  }

  async init(password) {
    const salt      = generateSalt()
    const keyResult = await deriveKey(password, salt)
    if (!keyResult.ok) return keyResult

    const payload = {
      schemaVersion: VAULT_SCHEMA_VERSION,
      createdAt:     Date.now(),
      lastSavedAt:   Date.now(),
      secrets:       [],
    }

    const encResult = await encryptJson(payload, keyResult.value)
    if (!encResult.ok) return encResult

    const w1 = this.#store.set(STORAGE.SALT_KEY,  bytesToHex(salt))
    const w2 = this.#store.set(STORAGE.VAULT_KEY, encResult.value)
    if (!w1.ok) return w1
    if (!w2.ok) return w2

    return ok(keyResult.value)
  }

  async unlock(password) {
    const saltHex = this.#store.get(STORAGE.SALT_KEY)
    const encoded = this.#store.get(STORAGE.VAULT_KEY)

    if (!saltHex || !encoded)
      return err(new AppError('VAULT_NOT_FOUND', 'No vault found in storage.'))

    const keyResult = await deriveKey(password, hexToBytes(saltHex))
    if (!keyResult.ok) return keyResult

    const decResult = await decryptJson(encoded, keyResult.value)
    if (!decResult.ok) return decResult

    if (!isValidPayload(decResult.value))
      return err(new AppError('INVALID_PAYLOAD', 'Vault payload failed validation'))

    return ok({ key: keyResult.value, secrets: decResult.value.secrets })
  }

  async persist(secrets, key) {
    const encoded  = this.#store.get(STORAGE.VAULT_KEY)
    let createdAt  = Date.now()

    if (encoded) {
      const existing = await decryptJson(encoded, key)
      if (existing.ok) createdAt = existing.value.createdAt
    }

    const encResult = await encryptJson(
      { schemaVersion: VAULT_SCHEMA_VERSION, createdAt, lastSavedAt: Date.now(), secrets },
      key
    )
    if (!encResult.ok) return encResult
    return this.#store.set(STORAGE.VAULT_KEY, encResult.value)
  }

  wipe() {
    this.#store.clear([STORAGE.SALT_KEY, STORAGE.VAULT_KEY])
  }
}

export const vaultRepository = new VaultRepositoryImpl()
