import { AlertCircle, ArrowRight, CalendarClock, CheckCircle2, Clock3, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import ContentListItem from '../components/content/ContentListItem'
import LoadingState from '../components/ui/LoadingState'
import StatusBadge from '../components/ui/StatusBadge'
import { formatShortDate } from '../utils'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { api.dashboard().then(setData).catch((err) => setError(err.message)) }, [])
  if (error) return <div className="error-card">{error}</div>
  if (!data) return <LoadingState />

  const cards = [
    ['Aguardando você', data.summary.pending, 'Para revisar agora', Clock3, 'amber'],
    ['Aprovados', data.summary.approved, 'Prontos para publicar', CheckCircle2, 'green'],
    ['Com alterações', data.summary.changes_requested, 'A agência está cuidando', AlertCircle, 'red'],
    ['Em revisão', data.summary.in_review, 'Nova versão a caminho', Sparkles, 'blue'],
  ]

  return (
    <div className="dashboard-page">
      <div className="page-heading"><div><span className="eyebrow">SEGUNDA, 28 DE SETEMBRO</span><h1>Olá, Marina <span>👋</span></h1><p>Você tem <strong>{data.summary.pending} conteúdos</strong> aguardando sua aprovação.</p></div><Link className="button primary" to="/contents/festival-de-massas">Começar revisão <ArrowRight size={17} /></Link></div>
      <div className="summary-grid">{cards.map(([label, value, note, Icon, tone]) => <article className="summary-card" key={label}><div className={`summary-icon ${tone}`}><Icon size={20} /></div><div><small>{label}</small><strong>{String(value).padStart(2, '0')}</strong><span>{note}</span></div></article>)}</div>

      <section className="dashboard-grid">
        <div className="panel pending-panel"><div className="section-heading"><div><h2>Pendentes de aprovação</h2><p>Sua decisão mantém o calendário em dia.</p></div><Link to="/calendar">Ver todos <ArrowRight size={15} /></Link></div><div className="content-list">{data.pending.map((item) => <ContentListItem content={item} key={item.id} />)}</div></div>
        <aside className="panel week-panel"><div className="section-heading"><div><h2>Próximos conteúdos</h2><p>Esta semana</p></div><CalendarClock size={19} /></div><div className="agenda-list">{data.upcoming.slice(0, 4).map((item) => <Link to={`/contents/${item.slug}`} key={item.id}><div className="agenda-date"><strong>{new Date(item.publication_date).getDate()}</strong><small>{formatShortDate(item.publication_date).split(' ')[1]}</small></div><div><strong>{item.title}</strong><small>{item.type} · {item.channel}</small></div><StatusBadge status={item.status} small /></Link>)}</div><Link to="/calendar" className="button secondary full">Abrir calendário</Link></aside>
      </section>

      <section className="panel recent-panel"><div className="section-heading"><div><h2>Atividade recente</h2><p>Acompanhe as últimas movimentações.</p></div></div><div className="content-list compact-list">{data.recent.slice(0, 4).map((item) => <ContentListItem content={item} key={item.id} compact />)}</div></section>
    </div>
  )
}
