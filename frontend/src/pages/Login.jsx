import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import PasswordInput from '../components/PasswordInput.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginSession } = useAuth()

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      loginSession(await login(email, password))
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your library."
      footer={<>New here? <Link to="/signup">Create an account</Link></>}
    >
      <form onSubmit={submit} className="auth-form">
        <label className="field"><span>Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
        </label>
        <label className="field"><span>Password</span>
          <PasswordInput value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
        <button type="button" className="demo-link" onClick={() => { setEmail('demo@library.com'); setPassword('demo123') }}>
          Fill demo login <small>(needs <code>npm run seed</code>)</small>
        </button>
      </form>
    </AuthLayout>
  )
}
