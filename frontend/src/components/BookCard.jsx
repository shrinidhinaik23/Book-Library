import Cover from './Cover.jsx'
import { EditIcon, TrashIcon } from './Icons.jsx'

export default function BookCard({ book, onEdit, onDelete, onToggleStatus }) {
  const available = book.status === 'Available'
  return (
    <article className="book-card">
      <div className="book-cover-wrap">
        <Cover book={book} />
        <span className={`ribbon ${available ? 'ribbon-ok' : 'ribbon-out'}`}>{book.status}</span>
      </div>
      <div className="book-info">
        <h3 title={book.title}>{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <span className="cat-tag">{book.category}</span>
      </div>
      <div className="book-actions">
        <button className={`btn btn-sm ${available ? 'btn-primary' : 'btn-outline'}`} onClick={() => onToggleStatus(book)}>
          {available ? 'Issue' : 'Mark returned'}
        </button>
        <button className="icon-btn" onClick={() => onEdit(book)} aria-label={`Edit ${book.title}`} title="Edit"><EditIcon size={16} /></button>
        <button className="icon-btn danger" onClick={() => onDelete(book)} aria-label={`Delete ${book.title}`} title="Delete"><TrashIcon size={16} /></button>
      </div>
    </article>
  )
}
