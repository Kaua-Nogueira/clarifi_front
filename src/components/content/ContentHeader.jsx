import { CalendarDays, Camera, ChevronLeft, Ellipsis, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../../utils'
import StatusBadge from '../ui/StatusBadge'

export default function ContentHeader({ content, onApprove, onChanges }) {
  return (
    <header className="content-header">
      <Link to="/dashboard" className="back-link"><ChevronLeft size={17} /> Voltar aos conteúdos</Link>
      <div className="content-heading-row"><div><div className="title-status"><h1>{content.title}</h1><StatusBadge status={content.status} /></div><div className="content-header-meta"><span><CalendarDays size={15} />{formatDate(content.publication_date)}</span><span><Camera size={15} />{content.channel}</span><span><UserRound size={15} />{content.responsible}</span></div></div><div className="header-actions"><button className="button secondary" onClick={onChanges}>Solicitar alteração</button><button className="button primary" onClick={onApprove}>Aprovar conteúdo</button><button className="icon-button more-button"><Ellipsis /></button></div></div>
    </header>
  )
}
