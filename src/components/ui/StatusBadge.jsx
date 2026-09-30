import { Check, Clock3, RefreshCw, Send, CircleAlert } from 'lucide-react'
import { statusMap } from '../../utils'

const icons = { pending: Clock3, approved: Check, changes_requested: CircleAlert, in_review: RefreshCw, published: Send }

export default function StatusBadge({ status, small = false }) {
  const item = statusMap[status] || statusMap.pending
  const Icon = icons[status] || Clock3
  return <span className={`status-badge status-${item.tone} ${small ? 'is-small' : ''}`}><Icon size={small ? 12 : 14} />{item.label}</span>
}
