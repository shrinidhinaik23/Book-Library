import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from './Icons.jsx'

export default function PasswordInput(props) {
  const [show, setShow] = useState(false)
  return (
    <div className="pw">
      <input {...props} type={show ? 'text' : 'password'} />
      <button type="button" className="pw-toggle" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
      </button>
    </div>
  )
}
