import { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext.jsx'
import { initial } from '../utils.js'
import { BookIcon, MoonIcon, SunIcon } from './Icons.jsx'

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('blm:theme') || 'light')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('blm:theme', theme)
  }, [theme])
  return [theme, () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))]
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const [theme, toggle] = useTheme()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand"><span className="brand-mark"><BookIcon size={18} /></span>Library</a>
        <div className="navbar-right">
          <button className="icon-toggle" onClick={toggle} aria-label="Toggle dark mode">{theme === 'dark' ? <SunIcon /> : <MoonIcon />}</button>
          <div className="user-chip">
            <span className="avatar">{initial(user?.name)}</span>
            <span className="user-name">{user?.name}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Log out</button>
        </div>
      </div>
    </nav>
  )
}
