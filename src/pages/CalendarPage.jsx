import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, ListFilter } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import ContentListItem from '../components/content/ContentListItem'
import LoadingState from '../components/ui/LoadingState'
import StatusBadge from '../components/ui/StatusBadge'

export default function CalendarPage() {
  const [month, setMonth] = useState(new Date(2026, 9, 1))
  const [contents, setContents] = useState(null)
  const [view, setView] = useState('calendar')
  useEffect(() => { setContents(null); api.contents(format(month, 'yyyy-MM')).then(setContents) }, [month])
  const days = useMemo(() => eachDayOfInterval({ start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }) }), [month])

  return (
    <div className="calendar-page">
      <div className="page-heading"><div><span className="eyebrow">PLANEJAMENTO EDITORIAL</span><h1>Calendário de conteúdo</h1><p>Visualize as próximas publicações e acompanhe cada aprovação.</p></div><div className="view-toggle"><button className={view === 'calendar' ? 'active' : ''} onClick={() => setView('calendar')}>Calendário</button><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>Lista</button></div></div>
      <section className="panel calendar-panel">
        <div className="calendar-toolbar"><div className="calendar-nav"><button className="icon-button" onClick={() => setMonth(subMonths(month, 1))}><ChevronLeft /></button><h2>{format(month, 'MMMM yyyy', { locale: ptBR })}</h2><button className="icon-button" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight /></button></div><div className="calendar-actions"><button className="button secondary"><ListFilter size={16} /> Filtrar</button><button className="button subtle" onClick={() => setMonth(new Date(2026, 9, 1))}>Hoje</button></div></div>
        {!contents ? <LoadingState label="Organizando o calendário…" /> : view === 'calendar' ? (
          <div className="calendar-grid"><div className="weekdays">{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-days">{days.map((day) => { const dayItems = contents.filter((item) => isSameDay(new Date(item.publication_date), day)); return <div className={`calendar-day ${!isSameMonth(day, month) ? 'muted' : ''}`} key={day.toISOString()}><span className="day-number">{format(day, 'd')}</span>{dayItems.map((item) => <Link className={`calendar-event event-${item.status}`} to={`/contents/${item.slug}`} key={item.id}><img src={item.thumbnail} alt="" /><div><strong>{item.title}</strong><small>{item.type}</small></div></Link>)}</div> })}</div></div>
        ) : <div className="calendar-list">{contents.map((item) => <ContentListItem content={item} key={item.id} />)}</div>}
      </section>
      {contents && <div className="calendar-legend">{['pending', 'approved', 'changes_requested', 'in_review', 'published'].map((status) => <StatusBadge status={status} small key={status} />)}</div>}
    </div>
  )
}
