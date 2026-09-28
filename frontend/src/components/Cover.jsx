import { coverFor } from '../utils.js'

export default function Cover({ book, small = false }) {
  return (
    <div className={`cover ${small ? 'cover-sm' : ''}`} style={{ background: coverFor(book.title) }} aria-hidden="true">
      <span className="cover-spine" />
      {!small && (
        <>
          <span className="cover-title">{book.title}</span>
          <span className="cover-author">{book.author}</span>
        </>
      )}
    </div>
  )
}
