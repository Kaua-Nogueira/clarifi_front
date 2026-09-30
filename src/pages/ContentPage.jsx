import { CheckCircle2, ChevronDown, CircleAlert, MessageSquare, PanelsTopLeft } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import ContentHeader from '../components/content/ContentHeader'
import ContentPreview from '../components/content/ContentPreview'
import ReviewSidebar from '../components/content/ReviewSidebar'
import SocialPreviewModal from '../components/content/SocialPreviewModal'
import LoadingState from '../components/ui/LoadingState'
import Modal from '../components/ui/Modal'

export default function ContentPage() {
  const { slug } = useParams()
  const [content, setContent] = useState(null)
  const [slide, setSlide] = useState(0)
  const [pinMode, setPinMode] = useState(false)
  const [pinDraft, setPinDraft] = useState(null)
  const [pinText, setPinText] = useState('')
  const [activeComment, setActiveComment] = useState(null)
  const [modal, setModal] = useState(null)
  const [decisionText, setDecisionText] = useState('')
  const [priority, setPriority] = useState('normal')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')
  const [mobileTab, setMobileTab] = useState('preview')
  const [socialPreviewOpen, setSocialPreviewOpen] = useState(false)

  const load = useCallback(() => api.content(slug).then(setContent), [slug])
  useEffect(() => { load() }, [load])
  useEffect(() => { if (!toast) return undefined; const timeout = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timeout) }, [toast])

  const addComment = async (data) => { await api.addComment(slug, data); await load(); setToast('Comentário adicionado.') }
  const resolve = async (id) => { await api.resolveComment(id); await load() }
  const selectComment = (comment) => { setActiveComment(comment.id); if (comment.asset_id) { const index = content.assets.findIndex((asset) => asset.id === comment.asset_id); if (index >= 0) setSlide(index) } }
  const createPin = (point) => { setPinDraft(point); setPinMode(false) }
  const submitPin = async () => {
    if (!pinText.trim()) return
    await addComment({ body: pinText, content_asset_id: pinDraft.assetId, position_x: pinDraft.x, position_y: pinDraft.y })
    setPinDraft(null); setPinText('')
  }
  const decide = async () => {
    setBusy(true)
    try {
      const updated = modal === 'approve' ? await api.approve(slug, { comment: decisionText }) : await api.requestChanges(slug, { comment: decisionText, priority })
      setContent(updated); setModal(null); setDecisionText(''); setToast(modal === 'approve' ? 'Conteúdo aprovado com sucesso.' : 'Alterações solicitadas à agência.')
    } finally { setBusy(false) }
  }

  if (!content) return <LoadingState label="Abrindo a área de revisão…" />
  return (
    <div className="content-page">
      <ContentHeader content={content} onApprove={() => setModal('approve')} onChanges={() => setModal('changes')} />
      <div className="review-guidance"><span>1</span><p><strong>Revise a peça</strong> e marque pontos específicos, se necessário.</p><i /><span>2</span><p><strong>Aprove</strong> ou solicite um ajuste.</p></div>
      <div className="mobile-review-tabs"><button className={mobileTab === 'preview' ? 'active' : ''} onClick={() => setMobileTab('preview')}><PanelsTopLeft />Peça</button><button className={mobileTab === 'review' ? 'active' : ''} onClick={() => setMobileTab('review')}><MessageSquare />Revisão <span>{content.comments.length}</span></button></div>
      <div className={`review-layout tab-${mobileTab}`}>
        <div className="review-center">
          <ContentPreview content={content} slide={slide} setSlide={setSlide} pinMode={pinMode} setPinMode={setPinMode} onPin={createPin} activeComment={activeComment} onPinSelect={setActiveComment} onSocialPreview={() => setSocialPreviewOpen(true)} />
          <details className="caption-card panel"><summary><div><span className="eyebrow">TEXTO DA PUBLICAÇÃO</span><strong>Ver legenda completa</strong></div><span>{content.caption?.length || 0} caracteres <ChevronDown size={16} /></span></summary><div className="caption-body"><p>{content.caption}</p><button>Copiar legenda</button></div></details>
        </div>
        <ReviewSidebar content={content} activeComment={activeComment} onSelect={selectComment} onAdd={addComment} onResolve={resolve} />
      </div>
      <div className="mobile-approval-bar"><button className="button secondary" onClick={() => setModal('changes')}>Pedir ajuste</button><button className="button primary" onClick={() => setModal('approve')}>Aprovar</button></div>

      <Modal open={modal === 'approve'} onClose={() => setModal(null)} eyebrow="DECISÃO FINAL" title="Aprovar este conteúdo?" description="A agência será avisada e o conteúdo seguirá para a programação." icon={<CheckCircle2 />} tone="success" size="small" footer={<><button className="button secondary" onClick={() => setModal(null)}>Voltar</button><button className="button primary" onClick={decide} disabled={busy}>{busy ? 'Aprovando…' : 'Sim, aprovar'}</button></>}>
        <label>Comentário opcional<textarea value={decisionText} onChange={(event) => setDecisionText(event.target.value)} placeholder="Deixe uma observação para a equipe…" /></label>
      </Modal>
      <Modal open={modal === 'changes'} onClose={() => setModal(null)} eyebrow="SOLICITAR AJUSTE" title="O que precisa mudar?" description="Explique o ajuste com clareza para agilizar a próxima versão." icon={<CircleAlert />} tone="warning" footer={<><button className="button secondary" onClick={() => setModal(null)}>Cancelar</button><button className="button danger" onClick={decide} disabled={busy || decisionText.trim().length < 5}>{busy ? 'Enviando…' : 'Solicitar alteração'}</button></>}>
        <label>Descrição da alteração <span>*</span><textarea value={decisionText} onChange={(event) => setDecisionText(event.target.value)} placeholder="Ex.: Gostaria de trocar a frase do segundo slide…" autoFocus /></label><label>Prioridade<select value={priority} onChange={(event) => setPriority(event.target.value)}><option value="low">Baixa</option><option value="normal">Normal</option><option value="high">Alta</option></select></label>
      </Modal>
      <Modal open={Boolean(pinDraft)} onClose={() => setPinDraft(null)} eyebrow="COMENTÁRIO NA PEÇA" title="Descreva o ajuste" description={`O comentário ficará preso a este ponto do slide ${slide + 1}.`} icon={<MessageSquare />} footer={<><button className="button secondary" onClick={() => setPinDraft(null)}>Cancelar</button><button className="button primary" onClick={submitPin} disabled={!pinText.trim()}>Adicionar comentário</button></>}><label>Comentário<textarea value={pinText} onChange={(event) => setPinText(event.target.value)} placeholder="O que você gostaria de ajustar aqui?" autoFocus /></label></Modal>
      <SocialPreviewModal open={socialPreviewOpen} onClose={() => setSocialPreviewOpen(false)} content={content} asset={content.assets[slide]} />
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  )
}
