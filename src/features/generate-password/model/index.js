export const DEFAULT_OPTIONS = {
  length: 20, useUppercase: true, useLowercase: true, useDigits: true, useSymbols: true,
}

const CS = {
  upper:  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:  'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  sym:    '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

export function generatePassword(opts) {
  let pool = ''
  if (opts.useUppercase) pool += CS.upper
  if (opts.useLowercase) pool += CS.lower
  if (opts.useDigits)    pool += CS.digits
  if (opts.useSymbols)   pool += CS.sym
  if (!pool)             pool  = CS.lower
  const buf = new Uint32Array(opts.length)
  crypto.getRandomValues(buf)
  return Array.from(buf).map((n) => pool[n % pool.length]).join('')
}

export function calcEntropy(opts) {
  let size = 0
  if (opts.useUppercase) size += 26
  if (opts.useLowercase) size += 26
  if (opts.useDigits)    size += 10
  if (opts.useSymbols)   size += 30
  if (!size)             size  = 26
  return Math.floor(opts.length * Math.log2(size))
}

export function strengthFromEntropy(bits) {
  if (bits < 40) return { label: 'Weak',        color: '#f87171', pct: 20  }
  if (bits < 60) return { label: 'Fair',         color: '#fbbf24', pct: 45  }
  if (bits < 80) return { label: 'Strong',       color: '#60a5fa', pct: 72  }
  return              { label: 'Very strong',   color: '#34d399', pct: 100 }
}
