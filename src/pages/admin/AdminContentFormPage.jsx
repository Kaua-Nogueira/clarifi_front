import { ArrowDown, ArrowLeft, ArrowUp, Eye, ImagePlus, Link2, LoaderCircle, Save, Trash2, UploadCloud } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../../api/client'
import LoadingState from '../../components/ui/LoadingState'

const emptyForm = {
  client_id: '', title: '', slug: '', channel: 'Instagram Feed', type: 'Post', status: 'draft',
  publication_date: '', responsible: 'Bianca Mendes', objective: '', editorial_line: '', cta: '', audience: '',
  caption: '', agency_notes: '', version_notes: '', assets: [],
}

const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function AdminContentFormPage() {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [urlAsset, setUrlAsset] = useState('')

  useEffect(() => {
    adminApi.clients().then(setClients)
    if (!editing) return
    adminApi.content(id).then((data) => {
      setForm({
        ...emptyForm, ...data, client_id: data.client.id,
        publication_date: data.publication_date?.slice(0, 16),
        assets: data.assets.map(({ url, alt_text, kind }) => ({ url, alt_text, kind })),
        version_notes: '',
      })
    }).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [editing, id])

  const field = (name, value) => setForm((current) => ({ ...current, [name]: value }))
  const titleChange = (value) => setForm((current) => ({ ...current, title: value, slug: editing || current.slug ? current.slug : slugify(value) }))
  const addUrl = () => {
    if (!urlAsset.trim()) return
    field('assets', [...form.assets, { url: urlAsset.trim(), alt_text: form.title || 'Criativo do conteúdo', kind: 'image' }]); setUrlAsset('')
  }
  const upload = async (event) => {
    const files = [...event.target.files]
    if (!files.length) return
    setUploading(true); setError('')
    try {
      const data = new FormData(); files.forEach((file) => data.append('files[]', file))
      const assets = await adminApi.uploadAssets(data)
      field('assets', [...form.assets, ...assets])
    } catch (err) { setError(err.message) } finally { setUploading(false); event.target.value = '' }
  }
  const moveAsset = (index, direction) => {
    const next = [...form.assets]; const destination = index + direction
    if (destination < 0 || destination >= next.length) return
    ;[next[index], next[destination]] = [next[destination], next[index]]; field('assets', next)
  }
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('')
    try {
      const saved = editing ? await adminApi.updateContent(id, form) : await adminApi.createContent(form)
      navigate(`/admin/contents/${saved.id}/edit`, { replace: true })
    } catch (err) { setError(err.message); window.scrollTo({ top: 0, behavior: 'smooth' }) } finally { setSaving(false) }
  }

  if (loading) return <LoadingState label="Carregando conteúdo…" />
  return (
    <form className="admin-page admin-content-form" onSubmit={submit}>
      <div className="admin-page-heading"><div><Link className="admin-back-link" to="/admin/contents"><ArrowLeft />Voltar para conteúdos</Link><span className="eyebrow">{editing ? 'EDIÇÃO DE CONTEÚDO' : 'NOVA ENTREGA'}</span><h1>{editing ? form.title : 'Criar conteúdo'}</h1><p>Configure o briefing, a publicação e as peças que o cliente irá revisar.</p></div><div className="admin-heading-actions">{editing && <Link className="button secondary" to={`/contents/${form.slug}`}><Eye />Ver no portal</Link>}<button className="button primary" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <Save />}{saving ? 'Salvando…' : 'Salvar conteúdo'}</button></div></div>
      {error && <div className="error-card">{error}</div>}
      <div className="admin-form-grid">
        <div className="admin-form-main">
          <section className="admin-panel admin-form-section"><div className="admin-section-heading"><div><h2>Informações principais</h2><p>Identificação e formato da entrega.</p></div><span>01</span></div><div className="form-grid two"><label>Título<input value={form.title} onChange={(event) => titleChange(event.target.value)} required /></label><label>Slug<input value={form.slug} onChange={(event) => field('slug', slugify(event.target.value))} required /></label><label>Cliente<select value={form.client_id} onChange={(event) => field('client_id', event.target.value)} required><option value="">Selecione</option>{clients.map((client) => <option value={client.id} key={client.id}>{client.name}</option>)}</select></label><label>Responsável<input value={form.responsible} onChange={(event) => field('responsible', event.target.value)} required /></label><label>Canal<select value={form.channel} onChange={(event) => field('channel', event.target.value)}><option>Instagram Feed</option><option>Instagram Stories</option><option>Instagram Reels</option><option>TikTok</option><option>LinkedIn</option><option>Facebook</option></select></label><label>Tipo<select value={form.type} onChange={(event) => field('type', event.target.value)}><option>Post</option><option>Carrossel</option><option>Stories</option><option>Vídeo</option><option>Roteiro</option></select></label></div></section>
          <section className="admin-panel admin-form-section"><div className="admin-section-heading"><div><h2>Briefing estratégico</h2><p>Contexto que orienta a aprovação do cliente.</p></div><span>02</span></div><div className="form-grid"><label>Objetivo<textarea value={form.objective} onChange={(event) => field('objective', event.target.value)} required /></label><div className="form-grid two"><label>Linha editorial<input value={form.editorial_line} onChange={(event) => field('editorial_line', event.target.value)} required /></label><label>CTA<input value={form.cta} onChange={(event) => field('cta', event.target.value)} required /></label></div><label>Público-alvo<input value={form.audience} onChange={(event) => field('audience', event.target.value)} required /></label><label>Legenda<textarea className="large-textarea" value={form.caption} onChange={(event) => field('caption', event.target.value)} /></label><label>Observações da agência<textarea value={form.agency_notes} onChange={(event) => field('agency_notes', event.target.value)} /></label></div></section>
          <section className="admin-panel admin-form-section"><div className="admin-section-heading"><div><h2>Peças do conteúdo</h2><p>Envie imagens e defina a ordem do carrossel.</p></div><span>03</span></div><label className={`admin-upload-zone ${uploading ? 'is-loading' : ''}`}><input type="file" accept="image/*" multiple onChange={upload} disabled={uploading} /><UploadCloud /><strong>{uploading ? 'Enviando imagens…' : 'Clique para enviar imagens'}</strong><small>PNG, JPG ou WEBP · até 10 MB cada</small></label><div className="asset-url-row"><div className="input-with-icon"><Link2 /><input placeholder="Ou cole a URL de uma imagem" value={urlAsset} onChange={(event) => setUrlAsset(event.target.value)} /></div><button className="button secondary" type="button" onClick={addUrl}>Adicionar</button></div>{form.assets.length === 0 ? <div className="admin-assets-empty"><ImagePlus /><span>Nenhuma peça adicionada.</span></div> : <div className="admin-assets-grid">{form.assets.map((asset, index) => <article key={`${asset.url}-${index}`}><div><img src={asset.url} alt={asset.alt_text} /><span>{index + 1}</span></div><input value={asset.alt_text} onChange={(event) => { const assets = [...form.assets]; assets[index] = { ...asset, alt_text: event.target.value }; field('assets', assets) }} aria-label={`Descrição da imagem ${index + 1}`} /><footer><button type="button" onClick={() => moveAsset(index, -1)} disabled={index === 0}><ArrowUp /></button><button type="button" onClick={() => moveAsset(index, 1)} disabled={index === form.assets.length - 1}><ArrowDown /></button><button className="danger" type="button" onClick={() => field('assets', form.assets.filter((_, assetIndex) => assetIndex !== index))}><Trash2 /></button></footer></article>)}</div>}</section>
        </div>
        <aside className="admin-form-aside"><section className="admin-panel admin-form-section"><div className="admin-section-heading"><div><h2>Publicação</h2><p>Status e agendamento.</p></div></div><div className="form-grid"><label>Status<select value={form.status} onChange={(event) => field('status', event.target.value)}><option value="draft">Rascunho</option><option value="pending">Pendente de aprovação</option><option value="in_review">Em revisão</option><option value="changes_requested">Alteração solicitada</option><option value="approved">Aprovado</option><option value="published">Publicado</option></select></label><label>Data e horário<input type="datetime-local" value={form.publication_date} onChange={(event) => field('publication_date', event.target.value)} required /></label></div></section><section className="admin-panel admin-form-section"><div className="admin-section-heading"><div><h2>{editing ? 'Nova versão' : 'Versão inicial'}</h2><p>Registre o que foi alterado.</p></div></div><label>Notas da versão<textarea value={form.version_notes} onChange={(event) => field('version_notes', event.target.value)} placeholder={editing ? 'Ex.: Ajustamos o CTA e substituímos a segunda imagem.' : 'Ex.: Primeira versão enviada para aprovação.'} /></label>{editing && <small className="form-help">Preencha apenas quando quiser criar uma nova entrada no histórico.</small>}</section></aside>
      </div>
    </form>
  )
}
