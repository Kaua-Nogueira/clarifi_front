import { Clock3, Crosshair, History, Megaphone, MessageSquare, Radio, Target, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '../../utils'
import CommentPanel from '../comments/CommentPanel'

const tabs = [
  { value: 'comments', label: 'Comentários', icon: MessageSquare },
  { value: 'briefing', label: 'Briefing', icon: Target },
  { value: 'versions', label: 'Versões', icon: History },
]

const InfoRow = ({ icon: Icon, label, children }) => (
  <div className="info-row"><span className="info-icon"><Icon size={16} /></span><div><small>{label}</small><p>{children}</p></div></div>
)

export default function ReviewSidebar({ content, activeComment, onSelect, onAdd, onResolve }) {
  const [tab, setTab] = useState('comments')

  return (
    <aside className="review-sidebar panel">
      <div className="review-sidebar-tabs">
        {tabs.map(({ value, label, icon: Icon }) => (
          <button className={tab === value ? 'active' : ''} onClick={() => setTab(value)} key={value}>
            <Icon size={15} /><span>{label}</span>{value === 'comments' && <em>{content.comments.length}</em>}
          </button>
        ))}
      </div>

      {tab === 'comments' && (
        <CommentPanel comments={content.comments} activeComment={activeComment} onSelect={onSelect} onAdd={onAdd} onResolve={onResolve} embedded />
      )}

      {tab === 'briefing' && (
        <div className="briefing-tab">
          <div className="sidebar-tab-heading"><span className="eyebrow">CONTEXTO ESSENCIAL</span><h2>O que você precisa saber</h2><p>Informações para avaliar a peça com segurança.</p></div>
          <div className="briefing-highlight"><Target size={18} /><div><small>OBJETIVO</small><p>{content.objective}</p></div></div>
          <div className="briefing-grid">
            <InfoRow icon={Radio} label="Linha editorial">{content.editorial_line}</InfoRow>
            <InfoRow icon={Megaphone} label="CTA">{content.cta}</InfoRow>
            <InfoRow icon={UsersRound} label="Público">{content.audience}</InfoRow>
            <InfoRow icon={Clock3} label="Publicação">{formatDate(content.publication_date, { weekday: 'short' })} · 19h</InfoRow>
          </div>
          <div className="agency-note"><Crosshair size={17} /><div><strong>Nota da agência</strong><p>{content.agency_notes}</p></div></div>
        </div>
      )}

      {tab === 'versions' && (
        <div className="versions-tab">
          <div className="sidebar-tab-heading"><span className="eyebrow">HISTÓRICO</span><h2>{content.versions.length} versões desta peça</h2><p>A versão mais recente aparece primeiro.</p></div>
          <div className="version-timeline">{content.versions.map((version) => (
            <div className={version.status === 'current' ? 'current' : ''} key={version.id}>
              <span>V{version.number}</span><div><div><strong>{version.status === 'current' ? 'Versão atual' : `Versão ${version.number}`}</strong>{version.status === 'current' && <em>Atual</em>}</div><p>{version.notes}</p><small>{formatDate(version.created_at)}</small></div>
            </div>
          ))}</div>
        </div>
      )}
    </aside>
  )
}
