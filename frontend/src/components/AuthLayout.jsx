import { BookIcon } from './Icons.jsx'

const SPINES = [
  ['#8b2e5f', 150], ['#1f4e79', 190], ['#b5541c', 130], ['#2f6f4f', 175], ['#5b3a8c', 160], ['#a3283c', 200], ['#0f6b73', 140],
]

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="auth-hero-top"><span className="brand-mark"><BookIcon size={18} /></span>Library</div>
        <div>
          <h2>Every book, right where you left it.</h2>
          <p>Catalogue your collection, track what's on the shelf and what's out on loan — all in one calm place.</p>
        </div>
        <div className="spines" aria-hidden="true">
          {SPINES.map(([c, h], i) => <span key={i} style={{ background: c, height: h }} />)}
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
          <p className="auth-switch">{footer}</p>
        </div>
      </div>
    </div>
  )
}
