export const nameToHue = (name) =>
  name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360

export const createSecret = (draft) => ({
  id:        crypto.randomUUID(),
  name:      draft.name.trim(),
  username:  draft.username.trim(),
  password:  draft.password,
  notes:     draft.notes?.trim() || undefined,
  colorHue:  nameToHue(draft.name),
  createdAt: Date.now(),
  updatedAt: Date.now(),
})

export const filterSecrets = (secrets, query) => {
  const q = query.trim().toLowerCase()
  if (!q) return secrets
  return secrets.filter(
    (s) => s.name.toLowerCase().includes(q) || s.username.toLowerCase().includes(q)
  )
}
