import { Edit3, Eye, FilePlus2, Image, Search, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { adminApi } from '../../api/client'
import LoadingState from '../../components/ui/LoadingState'
import StatusBadge from '../../components/ui/StatusBadge'
import { formatDate } from '../../utils'

export default function AdminContentsPage() {
  const [params] = useSearchParams()
  const [contents, setContents] = useState(null)
  const [clients, setClients] = useState([])
  const [filters, setFilters] = useState({ search: '', status: params.get('status') || '', client_id: '' })
  const [error, setError] = useState('')
  const load = useCallback(() => { setContents(null); adminApi.contents(filters).then(setContents).catch((err) => setError(err.message)) }, [filters])
  useEffect(() => { adminApi.clients().then(setClients) }, [])
  useEffect(() => { const timeout = setTimeout(load, 250); return () => clearTimeout(timeout) }, [load])
  const remove = async (item) => {
    if (!window.confirm(`Excluir “${item.title}”? Esta ação não pode ser desfeita.`)) return
    try { await adminApi.deleteContent(item.id); load() } catch (err) { setError(err.message) }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading"><div><span className="eyebrow">GESTÃO EDITORIAL</span><h1>Conteúdos</h1><p>Crie, organize e acompanhe todas as entregas dos clientes.</p></div><Link className="button primary" to="/admin/contents/new"><FilePlus2 />Novo conteúdo</Link></div>
      <section className="admin-panel admin-list-panel">
        <div className="admin-filters"><label><Search /><input placeholder="Buscar por título ou cliente…" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} /></label><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">Todos os status</option><option value="draft">Rascunho</option><option value="pending">Pendente</option><option value="in_review">Em revisão</option><option value="changes_requested">Alteração solicitada</option><option value="approved">Aprovado</option><option value="published">Publicado</option></select><select value={filters.client_id} onChange={(event) => setFilters({ ...filters, client_id: event.target.value })}><option value="">Todos os clientes</option>{clients.map((client) => <option value={client.id} key={client.id}>{client.name}</option>)}</select></div>
        {error && <div className="error-card">{error}</div>}
        {!contents ? <LoadingState /> : contents.length === 0 ? <div className="admin-empty"><FilePlus2 /><h3>Nenhum conteúdo encontrado</h3><p>Ajuste os filtros ou crie uma nova entrega.</p></div> : <div className="admin-table-wrap"><table className="admin-table admin-contents-table"><thead><tr><th>Conteúdo</th><th>Cliente</th><th>Publicação</th><th>Status</th><th>Revisão</th><th /></tr></thead><tbody>{contents.map((item) => <tr key={item.id}><td><Link className="admin-content-cell" to={`/admin/contents/${item.id}/edit`}>{item.thumbnail ? <img src={item.thumbnail} alt="" /> : <span><Image /></span>}<div><strong>{item.title}</strong><small>{item.type} · {item.channel} · {item.assets_count} peças</small></div></Link></td><td>{item.client}</td><td>{formatDate(item.publication_date)}</td><td><StatusBadge status={item.status} small /></td><td><span className={item.open_comments_count ? 'comment-count has-comments' : 'comment-count'}>{item.open_comments_count} abertos</span></td><td><div className="admin-row-actions"><Link to={`/contents/${item.slug}`} title="Ver portal"><Eye /></Link><Link to={`/admin/contents/${item.id}/edit`} title="Editar"><Edit3 /></Link><button onClick={() => remove(item)} title="Excluir"><Trash2 /></button></div></td></tr>)}</tbody></table></div>}
      </section>
    </div>
  )
}
