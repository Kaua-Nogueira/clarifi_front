import { MessageSquare, Send } from 'lucide-react'
import { useMemo, useState } from 'react'
import CommentItem from './CommentItem'

const filters = [['all', 'Todos'], ['open', 'Abertos'], ['resolved', 'Resolvidos'], ['specific', 'Na peça']]

export default function CommentPanel({ comments, activeComment, onSelect, onAdd, onResolve, embedded = false }) {
  const [filter, setFilter] = useState('all')
  const [text, setText] = useState('')
  const visible = useMemo(() => comments.filter((comment) => filter === 'all' || comment.status === filter || comment.type === filter), [comments, filter])
  const submit = async () => { if (!text.trim()) return; await onAdd({ body: text }); setText('') }
  return (
    <div className={`comments-panel ${embedded ? 'is-embedded' : 'panel'}`}>
      <div className="comments-header"><div><span className="eyebrow">CONVERSA</span><h2>Revise em conjunto</h2></div><MessageSquare size={19} /></div>
      <div className="comment-filters">{filters.map(([value, label]) => <button className={filter === value ? 'active' : ''} onClick={() => setFilter(value)} key={value}>{label}</button>)}</div>
      <div className="comment-list">{visible.length ? visible.map((comment, index) => <CommentItem key={comment.id} comment={comment} index={index} active={activeComment === comment.id} onSelect={onSelect} onResolve={onResolve} onReply={(parentId, body) => onAdd({ parent_id: parentId, body })} />) : <div className="empty-comments"><MessageSquare /><p>Nenhum comentário neste filtro.</p></div>}</div>
      <div className="general-comment-box"><span className="avatar small">MC</span><div><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Adicione um comentário geral…" /><button className="send-button" onClick={submit} disabled={!text.trim()} aria-label="Enviar comentário"><Send size={17} /></button></div></div>
    </div>
  )
}
