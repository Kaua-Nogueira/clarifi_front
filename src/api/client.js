const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function request(path, options = {}, token = null) {
  const isFormData = options.body instanceof FormData
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'Não foi possível concluir a solicitação.')
  return payload.data ?? payload
}

const adminToken = () => {
  try { return JSON.parse(localStorage.getItem('clarifi_admin_session'))?.token } catch { return null }
}
const adminRequest = (path, options = {}) => request(`/admin${path}`, options, adminToken())

export const api = {
  login: (data) => request('/login', { method: 'POST', body: JSON.stringify(data) }),
  dashboard: () => request('/dashboard'),
  contents: (month) => request(`/contents${month ? `?month=${month}` : ''}`),
  content: (slug) => request(`/contents/${slug}`),
  approve: (slug, data) => request(`/contents/${slug}/approve`, { method: 'POST', body: JSON.stringify(data) }),
  requestChanges: (slug, data) => request(`/contents/${slug}/request-changes`, { method: 'POST', body: JSON.stringify(data) }),
  addComment: (slug, data) => request(`/contents/${slug}/comments`, { method: 'POST', body: JSON.stringify(data) }),
  resolveComment: (id) => request(`/comments/${id}/resolve`, { method: 'PATCH' }),
}

export const adminApi = {
  login: (data) => request('/admin/login', { method: 'POST', body: JSON.stringify(data) }),
  dashboard: () => adminRequest('/dashboard'),
  clients: () => adminRequest('/clients'),
  createClient: (data) => adminRequest('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id, data) => adminRequest(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClient: (id) => adminRequest(`/clients/${id}`, { method: 'DELETE' }),
  contents: (filters = {}) => adminRequest(`/contents?${new URLSearchParams(Object.entries(filters).filter(([, value]) => value))}`),
  content: (id) => adminRequest(`/contents/${id}`),
  createContent: (data) => adminRequest('/contents', { method: 'POST', body: JSON.stringify(data) }),
  updateContent: (id, data) => adminRequest(`/contents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteContent: (id) => adminRequest(`/contents/${id}`, { method: 'DELETE' }),
  uploadAssets: (formData) => adminRequest('/uploads', { method: 'POST', body: formData }),
}
