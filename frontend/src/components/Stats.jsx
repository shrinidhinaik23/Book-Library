export default function Stats({ books }) {
  const available = books.filter(b => b.status === 'Available').length
  const cards = [
    { label: 'Total books', value: books.length },
    { label: 'Available', value: available, tone: 'ok' },
    { label: 'Issued', value: books.length - available, tone: 'out' },
    { label: 'Categories', value: new Set(books.map(b => b.category)).size },
  ]
  return (
    <div className="stats">
      {cards.map(c => (
        <div key={c.label} className={`stat ${c.tone ? `stat-${c.tone}` : ''}`}>
          <span className="stat-value">{c.value}</span>
          <span className="stat-label">{c.label}</span>
        </div>
      ))}
    </div>
  )
}
