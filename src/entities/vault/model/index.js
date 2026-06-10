export const INITIAL_VAULT_STATE = {
  status:    'locked',
  cryptoKey: null,
  secrets:   [],
}

export function vaultReducer(state, action) {
  switch (action.type) {
    case 'UNLOCK':
      return { status: 'unlocked', cryptoKey: action.key, secrets: action.secrets }
    case 'LOCK':
      return { ...INITIAL_VAULT_STATE }
    case 'ADD_SECRET':
      return { ...state, secrets: [action.secret, ...state.secrets] }
    case 'DELETE_SECRET':
      return { ...state, secrets: state.secrets.filter((s) => s.id !== action.id) }
    default:
      return state
  }
}
