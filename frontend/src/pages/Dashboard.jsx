import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../AuthContext.jsx'
import { useToast } from '../ToastContext.jsx'
import { addBook, deleteBook, getBooks, updateBook } from '../api.js'
import Stats from '../components/Stats.jsx'
import Toolbar from '../components/Toolbar.jsx'
import BookCard from '../components/BookCard.jsx'
import BookTable from '../components/BookTable.jsx'
import BookForm from '../components/BookForm.jsx'
import Modal from '../components/Modal.jsx'
import { BookIcon, PlusIcon } from '../components/Icons.jsx'

export default function Dashboard() {
  const { token, user } = useAuth()
  const toast = useToast()

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')            // debounced search sent to the API
  const [status, setStatus] = useState('All')
  const [category, setCategory] = useState('All')
  const [view, setView] = useState(() => localStorage.getItem('blm:view') || 'grid')
  const [modal, setModal] = useState(null)          // null | { book?: existing }
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  useEffect(() => { localStorage.setItem('blm:view', view) }, [view])
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setBooks(await getBooks(token, query))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token, query])

  useEffect(() => { load() }, [load])

  const categories = useMemo(() => [...new Set(books.map(b => b.category))].sort((a, b) => a.localeCompare(b)), [books])
  const counts = useMemo(() => ({
    all: books.length,
    available: books.filter(b => b.status === 'Available').length,
    issued: books.filter(b => b.status === 'Issued').length,
  }), [books])
  const visible = useMemo(
    () => books.filter(b => (status === 'All' || b.status === status) && (category === 'All' || b.category === category)),
    [books, status, category],
  )

  async function save(data) {
    setSaving(true)
    try {
      if (modal.book) {
        const updated = await updateBook(token, modal.book._id, data)
        setBooks(prev => prev.map(b => (b._id === updated._id ? updated : b)))
        toast('Book updated')
      } else {
        const created = await addBook(token, data)
        setBooks(prev => [created, ...prev])
        toast('Book added')
      }
      setModal(null)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(book) {
    const next = book.status === 'Available' ? 'Issued' : 'Available'
    setBooks(prev => prev.map(b => (b._id === book._id ? { ...b, status: next } : b)))   // optimistic
    try {
      await updateBook(token, book._id, { status: next })
      toast(next === 'Issued' ? `“${book.title}” issued` : `“${book.title}” returned`)
    } catch (err) {
      setBooks(prev => prev.map(b => (b._id === book._id ? { ...b, status: book.status } : b)))
      toast(err.message, 'error')
    }
  }

  async function confirmDelete() {
    const book = toDelete
    setToDelete(null)
    try {
      await deleteBook(token, book._id)
      setBooks(prev => prev.filter(b => b._id !== book._id))
      toast(`Deleted “${book.title}”`)
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const filtersActive = status !== 'All' || category !== 'All' || query !== ''

  return (
    <main className="page">
      <header className="page-head">
        <div>
          <h1>Hello, {user?.name?.split(' ')[0]}</h1>
          <p className="muted">Here's what's on your shelves today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({})}><PlusIcon size={16} /> Add book</button>
      </header>

      <Stats books={books} />

      <Toolbar
        search={search} onSearch={setSearch}
        status={status} onStatus={setStatus}
        category={category} onCategory={setCategory}
        categories={categories} view={view} onView={setView} counts={counts}
      />

      {error && (
        <div className="banner" role="alert">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline" onClick={load}>Retry</button>
        </div>
      )}

      {loading && books.length === 0 ? (
        <div className="grid">{Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton" />)}</div>
      ) : visible.length === 0 && !error ? (
        <div className="empty">
          <div className="empty-icon"><BookIcon size={30} /></div>
          <h3>{filtersActive ? 'No books match your filters' : 'Your library is empty'}</h3>
          <p className="muted">{filtersActive ? 'Try clearing the search or filters.' : 'Add your first book to get started.'}</p>
          {!filtersActive && <button className="btn btn-primary" onClick={() => setModal({})}><PlusIcon size={16} /> Add book</button>}
        </div>
      ) : view === 'grid' ? (
        <div className="grid">
          {visible.map(b => <BookCard key={b._id} book={b} onEdit={book => setModal({ book })} onDelete={setToDelete} onToggleStatus={toggleStatus} />)}
        </div>
      ) : (
        <BookTable books={visible} onEdit={book => setModal({ book })} onDelete={setToDelete} onToggleStatus={toggleStatus} />
      )}

      {modal && (
        <Modal title={modal.book ? 'Edit book' : 'Add a book'} onClose={() => setModal(null)}>
          <BookForm initial={modal.book} categories={categories} onSubmit={save} onCancel={() => setModal(null)} saving={saving} />
        </Modal>
      )}

      {toDelete && (
        <Modal title="Delete this book?" onClose={() => setToDelete(null)} narrow>
          <p className="muted">“{toDelete.title}” will be permanently removed from the library.</p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setToDelete(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
          </div>
        </Modal>
      )}
    </main>
  )
}
