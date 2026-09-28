const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')

let onUnauthorized = () => {}
export const setUnauthorizedHandler = fn => { onUnauthorized = fn }

async function request(path, { method = 'GET', body, token } = {}) {
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Check that the backend is running and VITE_API_URL is correct.')
  }

  const data = await res.json().catch(() => ({}))
  if (res.status === 401 && token) onUnauthorized()
  if (!res.ok) throw new Error(data.message || 'Something went wrong.')
  return data
}

export const signup = (name, email, password) => request('/auth/signup', { method: 'POST', body: { name, email, password } })
export const login = (email, password) => request('/auth/login', { method: 'POST', body: { email, password } })
export const getBooks = (token, search = '') => request(`/books${search ? `?search=${encodeURIComponent(search)}` : ''}`, { token })
export const addBook = (token, book) => request('/books', { method: 'POST', body: book, token })
export const updateBook = (token, id, book) => request(`/books/${id}`, { method: 'PUT', body: book, token })
export const deleteBook = (token, id) => request(`/books/${id}`, { method: 'DELETE', token })
