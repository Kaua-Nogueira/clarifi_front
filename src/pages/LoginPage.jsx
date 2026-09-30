import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Logo from '../components/ui/Logo'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: 'cliente@sabordavila.com.br', password: 'demo123' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('')
    try { await login(form); navigate('/dashboard') } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <Logo />
        <div className="login-quote"><span className="eyebrow light">APROVAÇÃO SEM RUÍDO</span><h1>Do primeiro olhar<br />ao “aprovado”.</h1><p>Todo o contexto, cada comentário e a decisão final em um só lugar.</p></div>
        <div className="login-preview-card"><div className="mini-art"><img src="/images/festival-massas-01.png" alt="Festival de Massas" /><span className="pin-demo">1</span></div><div><span className="approved-pill">✓ Aprovado</span><strong>Festival de Massas</strong><small>Aprovado por Marina agora</small></div></div>
        <small className="login-copyright">© 2026 Clarifi. Feito para boas ideias avançarem.</small>
      </section>
      <section className="login-form-panel">
        <div className="login-mobile-logo"><Logo /></div>
        <form onSubmit={submit} className="login-form">
          <span className="eyebrow">BEM-VINDA DE VOLTA</span><h2>Acesse seu portal</h2><p>Revise e aprove os próximos conteúdos da Sabor da Vila.</p>
          <label>E-mail<div className="input-with-icon"><Mail size={18} /><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div></label>
          <label>Senha<div className="input-with-icon"><LockKeyhole size={18} /><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Mostrar senha">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
          <div className="login-options"><label className="checkbox"><input type="checkbox" defaultChecked /> Manter conectado</label><a href="#recuperar">Esqueci minha senha</a></div>
          {error && <p className="form-error">{error}</p>}
          <button className="button primary large" disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}<ArrowRight size={18} /></button>
          <div className="demo-hint"><span>Dados para demonstração</span><code>cliente@sabordavila.com.br · demo123</code></div>
        </form>
      </section>
    </main>
  )
}
