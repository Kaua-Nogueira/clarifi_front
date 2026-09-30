import { Check, CornerDownRight, MapPin, MessageCircleReply } from 'lucide-react'
import { useState } from 'react'
import { formatTimeAgo } from '../../utils'

export default function CommentItem({ comment, index, active, onSelect, onResolve, onReply }) {
  const [replying, setReplying] = useState(false)
  const [reply, setReply] = useState('')
  const submitReply = async () => {
    if (!reply.trim()) return
    await onReply(comment.id, reply); setReply(''); setReplying(false)
  }
  return (
    <article className={`comment-item ${active ? 'active' : ''}`} onClick={() => onSelect(comment)}>
      <div className="comment-top"><span className={`avatar small ${comment.author_role === 'Agência' ? 'agency' : ''}`}>{comment.author_name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><strong>{comment.author_name}</strong><small>{comment.author_role} · {formatTimeAgo(comment.created_at)}</small></div>{comment.type === 'specific' && <span className="comment-location"><MapPin size={12} /> Ponto {index + 1}</span>}</div>
      <p>{comment.body}</p>
      {comment.replies?.length > 0 && <div className="reply-list">{comment.replies.map((item) => <div key={item.id}><CornerDownRight size={15} /><div><strong>{item.author_name}</strong><small>{item.author_role} · {formatTimeAgo(item.created_at)}</small><p>{item.body}</p></div></div>)}</div>}
      <div className="comment-actions"><button onClick={(event) => { event.stopPropagation(); setReplying(!replying) }}><MessageCircleReply size={14} /> Responder</button><button className={comment.status === 'resolved' ? 'resolved' : ''} onClick={(event) => { event.stopPropagation(); onResolve(comment.id) }}><Check size={14} />{comment.status === 'resolved' ? 'Resolvido' : 'Resolver'}</button></div>
      {replying && <div className="reply-box" onClick={(event) => event.stopPropagation()}><textarea autoFocus value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Escreva uma resposta…" /><div><button onClick={() => setReplying(false)}>Cancelar</button><button className="button primary small-button" onClick={submitReply}>Responder</button></div></div>}
    </article>
  )
}
