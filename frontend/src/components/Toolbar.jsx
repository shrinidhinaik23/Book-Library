import { GridIcon, ListIcon, SearchIcon } from './Icons.jsx'

export default function Toolbar({ search, onSearch, status, onStatus, category, onCategory, categories, view, onView, counts }) {
  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <div className="search">
          <SearchIcon size={16} />
          <input type="search" value={search} onChange={e => onSearch(e.target.value)} placeholder="Search by title or author…" aria-label="Search books" />
        </div>
        <select value={category} onChange={e => onCategory(e.target.value)} className="select" aria-label="Filter by category">
          <option value="All">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="seg" role="group" aria-label="View">
          <button className={view === 'grid' ? 'on' : ''} onClick={() => onView('grid')} aria-label="Grid view" title="Grid view"><GridIcon size={16} /></button>
          <button className={view === 'table' ? 'on' : ''} onClick={() => onView('table')} aria-label="Table view" title="Table view"><ListIcon size={16} /></button>
        </div>
      </div>
      <div className="chips">
        {[['All', counts.all], ['Available', counts.available], ['Issued', counts.issued]].map(([s, n]) => (
          <button key={s} className={`chip ${status === s ? 'chip-active' : ''}`} onClick={() => onStatus(s)}>
            {s} <b>{n}</b>
          </button>
        ))}
      </div>
    </div>
  )
}
