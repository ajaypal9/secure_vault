import { ok, err, AppError } from '@/shared/types'
import { CRYPTO } from '@/shared/constants'
import { bytesToHex, hexToBytes, encodeUtf8, decodeUtf8, toUint8 } from './encoding'

export const generateSalt = () =>
  crypto.getRandomValues(new Uint8Array(CRYPTO.SALT_BYTES))

export async function deriveKey(password, salt) {
  try {
    const material = await crypto.subtle.importKey(
      'raw', encodeUtf8(password), 'PBKDF2', false, ['deriveKey']
    )
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: CRYPTO.PBKDF2_ITERATIONS, hash: CRYPTO.PBKDF2_HASH },
      material,
      { name: 'AES-GCM', length: CRYPTO.AES_KEY_BITS },
      false,
      ['encrypt', 'decrypt']
    )
    return ok(key)
  } catch (e) {
    return err(new AppError('KEY_DERIVE_FAILED', 'PBKDF2 derivation failed', e))
  }
}

export async function encryptJson(payload, key) {
  try {
    const iv = crypto.getRandomValues(new Uint8Array(CRYPTO.AES_IV_BYTES))
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, key, encodeUtf8(JSON.stringify(payload))
    )
    return ok(`${bytesToHex(iv)}:${bytesToHex(toUint8(ciphertext))}`)
  } catch (e) {
    return err(new AppError('ENCRYPT_FAILED', 'AES-GCM encryption failed', e))
  }
}

export async function decryptJson(encoded, key) {
  try {
    const sep        = encoded.indexOf(':')
    if (sep === -1)  throw new Error('Missing IV separator')
    const iv         = hexToBytes(encoded.slice(0, sep))
    const ciphertext = hexToBytes(encoded.slice(sep + 1))
    const plaintext  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
    return ok(JSON.parse(decodeUtf8(plaintext)))
  } catch (e) {
    const isAuthFail = e instanceof Error && (e.name === 'OperationError' || e.message.includes('auth'))
    return err(new AppError(
      isAuthFail ? 'WRONG_PASSWORD' : 'DECRYPT_FAILED',
      isAuthFail ? 'Incorrect master password.' : `Decryption failed: ${String(e)}`,
      e
    ))
  }
}
