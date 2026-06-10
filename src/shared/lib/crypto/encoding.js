export const bytesToHex = (bytes) =>
  Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')

export const hexToBytes = (hex) => {
  if (hex.length % 2 !== 0) throw new Error(`Invalid hex length: ${hex.length}`)
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < arr.length; i++)
    arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return arr
}

export const encodeUtf8 = (s) => new TextEncoder().encode(s)
export const decodeUtf8 = (b) => new TextDecoder().decode(b)
export const toUint8    = (b) => new Uint8Array(b)
