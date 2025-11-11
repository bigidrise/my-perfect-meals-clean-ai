/**
 * Centralized API base resolution
 * Eliminates dev/prod URL inconsistencies
 */

export function resolveApiBase(): string {
  // Production Railway deployment
  if (window.location.hostname.includes('railway.app')) {
    console.log('🚂 Railway deployment detected, using origin:', window.location.origin);
    return window.location.origin;
  }

  // Local development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('💻 Local development detected');
    return 'http://localhost:5000';
  }

  // Replit deployment
  if (window.location.hostname.includes('replit.dev') || window.location.hostname.includes('repl.co')) {
    console.log('🔧 Replit deployment detected, using origin:', window.location.origin);
    return window.location.origin;
  }

  // Fallback to current origin
  console.log('🌐 Using default origin:', window.location.origin);
  return window.location.origin;
}

/**
 * Build full API URL
 */
export function apiUrl(path: string): string {
  const base = resolveApiBase();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}