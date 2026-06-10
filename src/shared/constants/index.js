export const VAULT_SCHEMA_VERSION = 1

export const CRYPTO = {
  PBKDF2_ITERATIONS: 310_000,
  PBKDF2_HASH: 'SHA-256',
  AES_KEY_BITS: 256,
  AES_IV_BYTES: 12,
  SALT_BYTES: 16,
}

export const STORAGE = {
  SALT_KEY:  'sv_salt',
  VAULT_KEY: 'sv_vault',
}

export const CLIPBOARD_CLEAR_MS = 8_000

export const GENERATOR_DEFAULTS = {
  length: 20,
  useUppercase: true,
  useLowercase: true,
  useDigits: true,
  useSymbols: true,
}

export const PASSWORD_MIN_LENGTH = 8
