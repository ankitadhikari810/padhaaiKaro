export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()
  if (configured) {
    return configured.replace(/\/+$/, '')
  }

  // If running in a browser, prefer localhost for local dev.
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5057'
    }

    // For deployed frontend, default to the deployed backend URL.
    return 'https://padhaaikaro-backend.onrender.com'
  }

  // Fallback when not running in a browser (e.g. SSR/build).
  return 'https://padhaaikaro-backend.onrender.com'
}
