import { Building2, Check, Edit3, Mail, Plus, Search, Trash2, UserRound, UsersRound } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminApi } from '../../api/client'
import LoadingState from '../../components/ui/LoadingState'
import Modal from '../../components/ui/Modal'

const emptyClient = { name: '', contact_name: '', email: '', segment: '', status: 'active' }

export default function AdminClientsPage() {
  const [clients, setClients] = useState(null)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deletingClient, setDeletingClient] = useState(null)
  const [form, setForm] = useState(emptyClient)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => adminApi.clients().then(setClients).catch((err) => setError(err.message)), [])
  useEffect(() => { load() }, [load])

  const filtered = useMemo(
    () => clients?.filter((client) => `${client.name} ${client.contact_name || ''} ${client.segment || ''}`.toLowerCase().includes(search.toLowerCase())),
    [clients, search],
  )

  const open = (client = null) => {
    setEditing(client)
    setForm(client ? { name: client.name, contact_name: client.contact_name || '', email: client.email || '', segment: client.segment || '', status: client.status } : emptyClient)
    setError('')
    setModalOpen(true)
  }

  const close = () => {
    setEditing(null)
    setForm(emptyClient)
    setModalOpen(false)
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      editing?.id ? await adminApi.updateClient(editing.id, form) : await adminApi.createClient(form)
      close()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!deletingClient) return
    setDeleting(true)
    setError('')
    try {
      await adminApi.deleteClient(deletingClient.id)
      setDeletingClient(null)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div><span className="eyebrow">CARTEIRA DA AGÊNCIA</span><h1>Clientes</h1><p>Gerencie contas, contatos e o volume de entregas.</p></div>
        <button className="button primary" onClick={() => open()}><Plus />Novo cliente</button>
      </div>

      {error && !modalOpen && !deletingClient && <div className="error-card">{error}</div>}

      <section className="admin-panel admin-list-panel">
        <div className="admin-filters"><label><Search /><input placeholder="Buscar cliente…" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>
        {!filtered ? <LoadingState /> : filtered.length === 0 ? (
          <div className="admin-empty"><UsersRound /><h3>Nenhum cliente encontrado</h3></div>
        ) : (
          <div className="admin-clients-grid">
            {filtered.map((client) => (
              <article key={client.id}>
                <header><span className="client-logo">{client.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span><span className={`client-state ${client.status}`}>{client.status === 'active' ? 'Ativo' : 'Inativo'}</span></header>
                <h2>{client.name}</h2>
                <p>{client.segment || 'Segmento não informado'}</p>
                <div className="client-contact"><span><Building2 />{client.contact_name || 'Sem contato principal'}</span><span><Mail />{client.email || 'Sem e-mail cadastrado'}</span></div>
                <footer><strong>{client.contents_count}<small> conteúdos</small></strong><div><button onClick={() => open(client)}><Edit3 />Editar</button><button className="danger" onClick={() => setDeletingClient(client)} disabled={client.contents_count > 0} aria-label={`Excluir ${client.name}`}><Trash2 /></button></div></footer>
              </article>
            ))}
          </div>
        )}
      </section>

      <Modal
        open={modalOpen}
        onClose={close}
        eyebrow="CARTEIRA DE CLIENTES"
        title={editing?.id ? 'Editar cliente' : 'Novo cliente'}
        description="Centralize os dados da conta e do contato responsável pelas aprovações."
        icon={<Building2 />}
        size="large"
        footer={<><button className="button secondary" onClick={close}>Cancelar</button><button className="button primary" type="submit" form="client-form" disabled={saving}><Check />{saving ? 'Salvando…' : editing?.id ? 'Salvar alterações' : 'Cadastrar cliente'}</button></>}
      >
        <form id="client-form" className="client-modal-form" onSubmit={submit}>
          {error && <div className="form-error">{error}</div>}
          <section className="client-form-section">
            <div className="client-form-section-heading"><strong>Dados da empresa</strong><span>Informações que identificam esta conta.</span></div>
            <div className="client-form-grid">
              <label className="field-full"><span>Nome da empresa <em>*</em></span><div className="modal-input"><Building2 /><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex.: Restaurante Sabor da Vila" required autoFocus /></div></label>
              <label><span>Segmento</span><input value={form.segment} onChange={(event) => setForm({ ...form, segment: event.target.value })} placeholder="Ex.: Gastronomia" /></label>
              <div className="client-status-field"><span>Status da conta</span><div className="client-status-options"><label className={form.status === 'active' ? 'selected' : ''}><input type="radio" name="status" value="active" checked={form.status === 'active'} onChange={(event) => setForm({ ...form, status: event.target.value })} /><span><i className="status-dot active" />Ativo</span></label><label className={form.status === 'inactive' ? 'selected' : ''}><input type="radio" name="status" value="inactive" checked={form.status === 'inactive'} onChange={(event) => setForm({ ...form, status: event.target.value })} /><span><i className="status-dot inactive" />Inativo</span></label></div></div>
            </div>
          </section>
          <section className="client-form-section">
            <div className="client-form-section-heading"><strong>Contato principal</strong><span>Pessoa que receberá e revisará os conteúdos.</span></div>
            <div className="client-form-grid">
              <label><span>Nome do contato</span><div className="modal-input"><UserRound /><input value={form.contact_name} onChange={(event) => setForm({ ...form, contact_name: event.target.value })} placeholder="Nome e sobrenome" /></div></label>
              <label><span>E-mail</span><div className="modal-input"><Mail /><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="contato@empresa.com" /></div></label>
            </div>
          </section>
        </form>
      </Modal>

      <Modal
        open={Boolean(deletingClient)}
        onClose={() => setDeletingClient(null)}
        eyebrow="EXCLUIR CONTA"
        title="Remover este cliente?"
        description="Esta ação não poderá ser desfeita."
        icon={<Trash2 />}
        tone="danger"
        size="small"
        footer={<><button className="button secondary" onClick={() => setDeletingClient(null)}>Cancelar</button><button className="button danger" onClick={remove} disabled={deleting}>{deleting ? 'Excluindo…' : 'Sim, excluir cliente'}</button></>}
      >
        {error && <div className="form-error">{error}</div>}
        <div className="modal-confirmation"><p>Você está removendo <strong>{deletingClient?.name}</strong> da carteira da agência.</p><span>Clientes com conteúdos vinculados não podem ser excluídos.</span></div>
      </Modal>
    </div>
  )
}
