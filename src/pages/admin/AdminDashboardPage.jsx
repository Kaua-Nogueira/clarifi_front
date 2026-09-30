import { AlertTriangle, ArrowRight, CalendarClock, FileStack, MessageSquareText, Plus, UsersRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/client'
import LoadingState from '../../components/ui/LoadingState'
import StatusBadge from '../../components/ui/StatusBadge'
import { formatDate } from '../../utils'

export default function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { adminApi.dashboard().then(setData).catch((err) => setError(err.message)) }, [])
  if (error) return <div className="error-card">{error}</div>
  if (!data) return <LoadingState label="Organizando a operação…" />

  const cards = [
    ['Clientes ativos', data.summary.clients, 'Contas acompanhadas', UsersRound, 'green'],
    ['Conteúdos', data.summary.contents, 'Total na operação', FileStack, 'blue'],
    ['Aguardando cliente', data.summary.pending, 'Precisam de decisão', CalendarClock, 'amber'],
    ['Ajustes pedidos', data.summary.changes_requested, 'Demandam atenção', AlertTriangle, 'red'],
  ]

  return (
    <div className="admin-page">
      <div className="admin-page-heading"><div><span className="eyebrow">OPERAÇÃO DA AGÊNCIA</span><h1>Bom dia, Bianca</h1><p>Acompanhe entregas, aprovações e pontos que precisam da equipe.</p></div><Link to="/admin/contents/new" className="button primary"><Plus />Novo conteúdo</Link></div>
      <div className="admin-stats">{cards.map(([label, value, note, Icon, tone]) => <article key={label}><span className={`admin-stat-icon ${tone}`}><Icon /></span><div><small>{label}</small><strong>{String(value).padStart(2, '0')}</strong><p>{note}</p></div></article>)}</div>
      <div className="admin-dashboard-grid">
        <section className="admin-panel"><div className="admin-section-heading"><div><h2>Movimentações recentes</h2><p>Últimos conteúdos atualizados pela equipe ou clientes.</p></div><Link to="/admin/contents">Ver todos <ArrowRight /></Link></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Conteúdo</th><th>Cliente</th><th>Publicação</th><th>Status</th></tr></thead><tbody>{data.recent.map((item) => <tr key={item.id}><td><Link to={`/admin/contents/${item.id}/edit`} className="admin-content-cell">{item.thumbnail ? <img src={item.thumbnail} alt="" /> : <span />}<div><strong>{item.title}</strong><small>{item.type} · {item.channel}</small></div></Link></td><td>{item.client}</td><td>{formatDate(item.publication_date)}</td><td><StatusBadge status={item.status} small /></td></tr>)}</tbody></table></div></section>
        <aside className="admin-panel admin-attention"><div className="admin-section-heading"><div><h2>Radar da equipe</h2><p>O que merece atenção agora.</p></div><MessageSquareText /></div><div className="attention-number"><strong>{data.summary.open_comments}</strong><span>comentários abertos</span></div><div className="attention-items"><span><i className="red" />{data.summary.changes_requested} conteúdos com alterações</span><span><i className="amber" />{data.summary.pending} aguardando aprovação</span><span><i className="green" />{data.upcoming.length} próximas publicações</span></div><Link to="/admin/contents?status=changes_requested" className="button secondary full">Abrir pendências</Link></aside>
      </div>
      <section className="admin-panel"><div className="admin-section-heading"><div><h2>Próximas publicações</h2><p>Agenda editorial mais próxima.</p></div><Link to="/admin/calendar">Abrir calendário <ArrowRight /></Link></div><div className="admin-upcoming">{data.upcoming.map((item) => <Link to={`/admin/contents/${item.id}/edit`} key={item.id}><span className="admin-upcoming-date"><strong>{new Date(item.publication_date).getDate()}</strong><small>{new Date(item.publication_date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</small></span><div><strong>{item.title}</strong><small>{item.client} · {item.channel}</small></div><StatusBadge status={item.status} small /></Link>)}</div></section>
    </div>
  )
}
