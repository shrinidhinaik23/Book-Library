import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const str = v => (typeof v === 'string' ? v.trim() : '')

const sign = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
const publicUser = u => ({ id: u._id, name: u.name, email: u.email })

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const name = str(req.body?.name)
    const email = str(req.body?.email).toLowerCase()
    const password = typeof req.body?.password === 'string' ? req.body.password : ''

    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are all required.' })
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Please enter a valid email address.' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' })

    if (await User.findOne({ email })) return res.status(409).json({ message: 'An account with this email already exists.' })

    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) })
    res.status(201).json({ token: sign(user._id), user: publicUser(user) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Signup failed. Please try again.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const email = str(req.body?.email).toLowerCase()
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' })

    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    res.json({ token: sign(user._id), user: publicUser(user) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Login failed. Please try again.' })
  }
})

// GET /api/auth/me — lets the frontend confirm a stored token is still valid
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(401).json({ message: 'Account no longer exists.' })
    res.json({ user: publicUser(user) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not load account.' })
  }
})

export default router
