import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Logo from '../../components/ui/Logo'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminLoginPage() {
  const { adminLogin, isAdminAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'agencia@clarifi.com.br', password: 'admin123' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  if (isAdminAuthenticated) return <Navigate to="/admin/dashboard" replace />

  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('')
    try { await adminLogin(form); navigate('/admin/dashboard') } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-intro">
        <Logo />
        <div><span className="eyebrow light">CENTRAL DA AGÊNCIA</span><h1>Planeje, entregue<br />e acompanhe.</h1><p>Uma operação clara para sua equipe conduzir clientes, conteúdos e aprovações sem ruído.</p></div>
        <div className="admin-login-metrics"><span><strong>12</strong><small>entregas no mês</small></span><span><strong>84%</strong><small>aprovado no prazo</small></span></div>
      </section>
      <section className="admin-login-form-wrap">
        <form className="admin-login-form" onSubmit={submit}>
          <div className="admin-login-icon"><ShieldCheck /></div><span className="eyebrow">ACESSO RESTRITO</span><h2>Painel administrativo</h2><p>Entre com as credenciais da agência.</p>
          <label>E-mail<div className="input-with-icon"><Mail /><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></div></label>
          <label>Senha<div className="input-with-icon"><LockKeyhole /><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
          {error && <p className="form-error">{error}</p>}
          <button className="button primary large" disabled={loading}>{loading ? 'Entrando…' : 'Entrar no painel'}<ArrowRight /></button>
          <div className="demo-hint"><span>Acesso de demonstração</span><code>agencia@clarifi.com.br · admin123</code></div>
        </form>
      </section>
    </main>
  )
}
