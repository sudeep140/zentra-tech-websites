/**
 * Helper to normalize image and asset URLs across dev and prod
 */
export function getAssetUrl(path: string | undefined | null, fallback = '/assets/zentra-tech.png'): string {
  if (!path || typeof path !== 'string') return fallback;
  
  // If already full http(s) URL or data URL
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Strip leading public/ or public\ and normalize backslashes
  let clean = path.replace(/^public[/\\]/, '').replace(/\\/g, '/');

  // Ensure leading slash
  if (!clean.startsWith('/')) {
    clean = `/${clean}`;
  }

  return clean;
}

export function handleImageFallback(e: React.SyntheticEvent<HTMLImageElement, Event>, fallback = '/assets/zentra-tech.png') {
  const target = e.currentTarget;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
