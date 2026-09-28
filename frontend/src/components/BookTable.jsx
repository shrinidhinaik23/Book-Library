import Cover from './Cover.jsx'
import { EditIcon, TrashIcon } from './Icons.jsx'

export default function BookTable({ books, onEdit, onDelete, onToggleStatus }) {
  return (
    <div className="table-wrap card">
      <table className="book-table">
        <thead>
          <tr><th>Title</th><th>Author</th><th>Category</th><th>Status</th><th aria-label="Actions" /></tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book._id}>
              <td><div className="t-title"><Cover book={book} small /><span>{book.title}</span></div></td>
              <td>{book.author}</td>
              <td><span className="cat-tag">{book.category}</span></td>
              <td>
                <button className={`status-pill ${book.status === 'Available' ? 'available' : 'issued'}`} onClick={() => onToggleStatus(book)} title="Click to toggle status">
                  {book.status}
                </button>
              </td>
              <td className="t-actions">
                <button className="icon-btn" onClick={() => onEdit(book)} aria-label={`Edit ${book.title}`}><EditIcon size={16} /></button>
                <button className="icon-btn danger" onClick={() => onDelete(book)} aria-label={`Delete ${book.title}`}><TrashIcon size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
