// A small set of curated cover palettes; a book's title picks one deterministically.
const COVERS = [
  ['#8b2e5f', '#4a1230'], ['#1f4e79', '#0e2a47'], ['#2f6f4f', '#153a28'], ['#b5541c', '#6e2e0c'],
  ['#5b3a8c', '#2f1c52'], ['#0f6b73', '#073a3f'], ['#8a6d1d', '#4d3b0a'], ['#a3283c', '#5c1220'],
]

export function coverFor(title = '') {
  let h = 0
  for (const ch of title) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const [a, b] = COVERS[h % COVERS.length]
  return `linear-gradient(155deg, ${a}, ${b})`
}

export const initial = name => (name || '?').trim().charAt(0).toUpperCase()
