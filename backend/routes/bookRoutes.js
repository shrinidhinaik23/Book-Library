import express from 'express'
import mongoose from 'mongoose'
import Book from '../models/Book.js'
import auth from '../middleware/auth.js'

const router = express.Router()
const STATUSES = ['Available', 'Issued']
const str = v => (typeof v === 'string' ? v.trim() : '')
const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// GET /api/books?search=term  — all books, optionally matched on title or author
router.get('/', auth, async (req, res) => {
  try {
    const search = str(req.query.search)
    const query = search
      ? { $or: [{ title: { $regex: escapeRegex(search), $options: 'i' } }, { author: { $regex: escapeRegex(search), $options: 'i' } }] }
      : {}
    res.json(await Book.find(query).sort({ createdAt: -1 }))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not fetch books.' })
  }
})

// POST /api/books
router.post('/', auth, async (req, res) => {
  try {
    const title = str(req.body?.title), author = str(req.body?.author), category = str(req.body?.category)
    if (!title || !author || !category) return res.status(400).json({ message: 'Title, author and category are required.' })
    const status = STATUSES.includes(req.body?.status) ? req.body.status : 'Available'
    res.status(201).json(await Book.create({ title, author, category, status, addedBy: req.userId }))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not add the book.' })
  }
})

// PUT /api/books/:id — updates only the fields that were sent
router.put('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid book id.' })

    const update = {}
    for (const field of ['title', 'author', 'category']) {
      if (req.body?.[field] !== undefined) {
        const v = str(req.body[field])
        if (!v) return res.status(400).json({ message: `${field[0].toUpperCase() + field.slice(1)} cannot be empty.` })
        update[field] = v
      }
    }
    if (req.body?.status !== undefined) {
      if (!STATUSES.includes(req.body.status)) return res.status(400).json({ message: 'Status must be Available or Issued.' })
      update.status = req.body.status
    }
    if (!Object.keys(update).length) return res.status(400).json({ message: 'Nothing to update.' })

    const book = await Book.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    if (!book) return res.status(404).json({ message: 'Book not found.' })
    res.json(book)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not update the book.' })
  }
})

// DELETE /api/books/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid book id.' })
    const book = await Book.findByIdAndDelete(req.params.id)
    if (!book) return res.status(404).json({ message: 'Book not found.' })
    res.json({ message: 'Book deleted.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not delete the book.' })
  }
})

export default router
