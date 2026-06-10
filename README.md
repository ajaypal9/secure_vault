# Secure Vault

Frontend-only encrypted password manager built to production-grade architecture standards.

```
npm install && npm run dev
npm test
npm run type-check
npm run lint
```

---

## Architecture: Feature-Sliced Design (FSD)

```
src/
├── app/                         # Bootstrap, providers, global config
│   ├── providers/
│   │   ├── VaultContext.tsx     # useReducer vault state machine
│   │   ├── ToastContext.tsx     # Toast notification system
│   │   └── index.tsx            # AppProviders composition root
│   ├── styles/globals.css       # CSS custom properties (design tokens) + reset
│   ├── config/test.setup.ts     # Vitest global mocks
│   └── main.tsx                 # ReactDOM.createRoot entry
│
├── pages/                       # Route-level compositions (no business logic)
│   ├── lock-page/               # Composes LockScreen feature
│   └── vault-page/              # Composes VaultHeader + SecretList widgets + Modal
│
├── widgets/                     # Complex UI blocks; can read context, call features
│   ├── secret-list/             # SecretCard grid + search + clipboard + delete wiring
│   └── vault-header/            # Brand + secret count + Lock + Add actions
│
├── features/                    # User interactions — fully self-contained slices
│   ├── auth-vault/
│   │   ├── lib/vaultRepository.ts  # Concrete impl of VaultRepository (crypto + storage)
│   │   ├── model/index.ts          # Async action orchestrators (init/unlock/add/delete/lock)
│   │   └── ui/LockScreen.tsx       # Form UI: first-run init + returning unlock
│   ├── manage-secret/
│   │   ├── model/index.ts          # Re-exports add/delete actions
│   │   └── ui/AddSecretForm.tsx    # Form: validation, generator toggle, save
│   └── generate-password/
│       ├── model/index.ts          # generatePassword, calcEntropy, strengthFromEntropy
│       └── ui/PasswordGenerator.tsx # Interactive generator panel
│
├── entities/                    # Domain objects — model, API contract, display
│   ├── secret/
│   │   ├── api/index.ts         # SecretRepository interface (inversion of control)
│   │   ├── model/index.ts       # createSecret, updateSecret, filterSecrets, nameToHue
│   │   └── ui/SecretCard.tsx    # Pure display: avatar, fields, copy, delete (injected)
│   └── vault/
│       ├── api/index.ts         # VaultRepository interface
│       └── model/index.ts       # vaultReducer + VaultState + VaultAction (pure)
│
└── shared/                      # Zero business logic; lowest layer
    ├── lib/
    │   ├── crypto/
    │   │   ├── encoding.ts      # bytesToHex, hexToBytes, encodeUtf8, decodeUtf8 (pure)
    │   │   └── subtle.ts        # deriveKey, encryptJson, decryptJson (SubtleCrypto wrapper)
    │   ├── storage/index.ts     # StorageAdapter interface + localStorageAdapter impl
    │   ├── clipboard/index.ts   # ClipboardService with auto-clear
    │   └── validation/index.ts  # Zod schemas → inferred types (single source of truth)
    ├── ui/
    │   ├── button/              # Button: variant, size, loading, hover state
    │   ├── input/               # Input: label, error, hint, leftSlot, rightSlot
    │   ├── modal/               # Modal: ESC, click-outside, scroll-lock, animation
    │   ├── toast/               # ToastList: renders active toasts from context
    │   └── field-row/           # Compound component: Root + Content + Actions
    ├── types/index.ts           # All domain types + Result monad + AppError
    ├── constants/index.ts       # CRYPTO, STORAGE, GENERATOR_DEFAULTS
    └── config/index.ts          # appConfig, feature flags
```

---

## Layer Dependency Rules (enforced by eslint-plugin-boundaries)

| Layer    | Can import from |
|----------|----------------|
| app      | pages, widgets, features, entities, shared |
| pages    | widgets, features, entities, shared |
| widgets  | features, entities, shared |
| features | entities, shared |
| entities | shared |
| shared   | nothing |

Violations are **lint errors** — enforced at CI time, not by convention.

---

## Key Architectural Decisions

### Feature-Sliced Design over file-type grouping
FSD groups code by business domain and user interaction, not by technical role (`components/`, `hooks/`, `utils/`). When a feature changes, you touch one slice — not files scattered across four folders.

### Interface-first (Dependency Inversion)
`entities/secret/api` and `entities/vault/api` define *contracts* (TypeScript interfaces). The concrete implementations (`vaultRepository.ts`) live in `features/auth-vault/lib`. This means entities are decoupled from storage and crypto — they can be unit-tested without any I/O.

### Optimistic updates with rollback
`addSecretAction` and `deleteSecretAction` dispatch the state change *before* awaiting `vaultRepository.persist(...)`. If persist fails, they reverse the dispatch. UI is always instant; errors are surfaced as toasts.

### Zod schemas as single source of truth
`shared/lib/validation` defines schemas with `z.infer<>` — form types are derived from schemas, not written twice. `validateForm()` returns typed per-field errors ready for UI rendering.

### Result monad (no invisible throws)
All async operations return `Result<T>`. Components handle errors explicitly — `if (!result.ok) toast(result.error.message, 'error')`. No silent failures from unhandled async exceptions.

### Co-located tests
Tests live next to the files they cover (`model/index.test.ts` beside `model/index.ts`). Easier to find, harder to drift, deleted together when the source is deleted.

### Split Context (State + Dispatch)
VaultContext uses two separate React contexts — one for state, one for dispatch. Components that only dispatch (e.g. the lock button) don't re-render when secrets change.

---

## Crypto Design

| Property | Value |
|---|---|
| Algorithm | AES-256-GCM (authenticated — tamper-evident) |
| Key derivation | PBKDF2-HMAC-SHA256, 310,000 iterations |
| Salt | 16 bytes random, generated once per device |
| IV | 12 bytes random, regenerated on every write |
| Key persistence | Never — non-extractable CryptoKey, memory-only |
| Clipboard | Auto-overwritten after 8 seconds |
