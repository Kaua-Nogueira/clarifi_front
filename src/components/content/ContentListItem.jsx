import { ArrowRight, CalendarDays, Camera, Images } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from '../ui/StatusBadge'
import { formatShortDate } from '../../utils'

export default function ContentListItem({ content, compact = false }) {
  return (
    <Link to={`/contents/${content.slug}`} className={`content-row ${compact ? 'is-compact' : ''}`}>
      <img src={content.thumbnail} alt="" />
      <div className="content-row-main">
        <div className="content-row-title"><strong>{content.title}</strong><StatusBadge status={content.status} small /></div>
        <div className="content-meta"><span><CalendarDays size={14} />{formatShortDate(content.publication_date)}</span><span><Camera size={14} />{content.channel.replace('Instagram ', '')}</span><span><Images size={14} />{content.type}</span></div>
      </div>
      <ArrowRight className="row-arrow" size={18} />
    </Link>
  )
}
