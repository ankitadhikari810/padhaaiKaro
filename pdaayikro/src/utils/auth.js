const STORAGE_KEY = 'pdaayikro_user'

export function getStoredUser() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return null

  try {
    return JSON.parse(saved)
  } catch (_error) {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEY)
}

export { STORAGE_KEY }
