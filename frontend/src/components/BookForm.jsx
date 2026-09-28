import { useState } from 'react'

export default function BookForm({ initial, categories, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState({ title: '', author: '', category: '', status: 'Available', ...initial })
  const [errors, setErrors] = useState({})

  const change = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(er => ({ ...er, [name]: undefined }))
  }

  function submit(e) {
    e.preventDefault()
    const err = {}
    if (!form.title.trim()) err.title = 'Title is required.'
    if (!form.author.trim()) err.author = 'Author is required.'
    if (!form.category.trim()) err.category = 'Category is required.'
    setErrors(err)
    if (Object.keys(err).length) return
    onSubmit({ title: form.title.trim(), author: form.author.trim(), category: form.category.trim(), status: form.status })
  }

  return (
    <form onSubmit={submit} noValidate>
      <label className="field"><span>Title</span>
        <input name="title" value={form.title} onChange={change} placeholder="e.g. Clean Code" className={errors.title ? 'invalid' : ''} autoFocus />
        {errors.title && <em className="err">{errors.title}</em>}
      </label>
      <label className="field"><span>Author</span>
        <input name="author" value={form.author} onChange={change} placeholder="e.g. Robert C. Martin" className={errors.author ? 'invalid' : ''} />
        {errors.author && <em className="err">{errors.author}</em>}
      </label>
      <label className="field"><span>Category</span>
        <input name="category" value={form.category} onChange={change} list="category-options" placeholder="e.g. Software Engineering" className={errors.category ? 'invalid' : ''} />
        <datalist id="category-options">{categories.map(c => <option key={c} value={c} />)}</datalist>
        {errors.category && <em className="err">{errors.category}</em>}
      </label>
      <div className="field"><span>Status</span>
        <div className="seg seg-wide">
          {['Available', 'Issued'].map(s => (
            <button key={s} type="button" className={form.status === s ? 'on' : ''} onClick={() => setForm(f => ({ ...f, status: s }))}>{s}</button>
          ))}
        </div>
      </div>
      <div className="modal-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : initial?._id ? 'Save changes' : 'Add book'}</button>
      </div>
    </form>
  )
}
