import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/client'
import LoadingState from '../../components/ui/LoadingState'

export default function AdminCalendarPage() {
  const [month, setMonth] = useState(new Date(2026, 9, 1))
  const [contents, setContents] = useState(null)
  useEffect(() => { adminApi.contents().then(setContents) }, [])
  const days = useMemo(() => eachDayOfInterval({ start: startOfWeek(startOfMonth(month)), end: endOfWeek(endOfMonth(month)) }), [month])
  const monthContents = useMemo(() => contents?.filter((item) => isSameMonth(new Date(item.publication_date), month)) || [], [contents, month])
  return (
    <div className="admin-page">
      <div className="admin-page-heading"><div><span className="eyebrow">PLANEJAMENTO DA AGÊNCIA</span><h1>Calendário editorial</h1><p>Visualize o volume de publicações de todos os clientes.</p></div><Link to="/admin/contents/new" className="button primary"><Plus />Novo conteúdo</Link></div>
      <section className="admin-panel admin-calendar-panel"><div className="admin-calendar-toolbar"><button className="icon-button" onClick={() => setMonth(subMonths(month, 1))}><ChevronLeft /></button><div><strong>{format(month, 'MMMM yyyy', { locale: ptBR })}</strong><small>{monthContents.length} conteúdos programados</small></div><button className="icon-button" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight /></button></div>{!contents ? <LoadingState /> : <div className="admin-calendar"><div className="admin-weekdays">{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => <span key={day}>{day}</span>)}</div><div className="admin-calendar-days">{days.map((day) => { const items = contents.filter((item) => isSameDay(new Date(item.publication_date), day)); return <div className={!isSameMonth(day, month) ? 'muted' : ''} key={day.toISOString()}><span>{format(day, 'd')}</span>{items.slice(0, 3).map((item) => <Link className={`admin-calendar-event status-${item.status}`} to={`/admin/contents/${item.id}/edit`} key={item.id}>{item.thumbnail && <img src={item.thumbnail} alt="" />}<div><strong>{item.title}</strong><small>{item.client}</small></div></Link>)}{items.length > 3 && <small className="more-events">+{items.length - 3} conteúdos</small>}</div> })}</div></div>}</section>
    </div>
  )
}
