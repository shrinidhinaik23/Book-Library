import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signup } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import PasswordInput from '../components/PasswordInput.jsx'

export default function Signup() {
  const [name, setName] = useState('')
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
      loginSession(await signup(name, email, password))
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes a few seconds."
      footer={<>Already registered? <Link to="/login">Log in</Link></>}
    >
      <form onSubmit={submit} className="auth-form">
        <label className="field"><span>Name</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required autoFocus />
        </label>
        <label className="field"><span>Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </label>
        <label className="field"><span>Password</span>
          <PasswordInput value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Creating account…' : 'Sign up'}</button>
      </form>
    </AuthLayout>
  )
}
