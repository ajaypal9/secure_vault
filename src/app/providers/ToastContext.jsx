import { createContext, useContext, useReducer, useCallback } from 'react'
import { ToastList } from '@/shared/ui/toast'

const ToastsCtx  = createContext([])
const ToastFnCtx = createContext(() => {})

function reducer(state, action) {
  if (action.type === 'ADD')    return [...state, action.toast]
  if (action.type === 'REMOVE') return state.filter((t) => t.id !== action.id)
  return state
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(reducer, [])

  const toast = useCallback((message, variant = 'info', durationMs = 3200) => {
    const id = crypto.randomUUID()
    dispatch({ type: 'ADD', toast: { id, message, variant, durationMs } })
    setTimeout(() => dispatch({ type: 'REMOVE', id }), durationMs)
  }, [])

  return (
    <ToastsCtx.Provider value={toasts}>
      <ToastFnCtx.Provider value={toast}>
        {children}
        <ToastList toasts={toasts} />
      </ToastFnCtx.Provider>
    </ToastsCtx.Provider>
  )
}

export const useToastContext = () => useContext(ToastFnCtx)
