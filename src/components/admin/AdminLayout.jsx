import { Bell, CalendarDays, FileStack, LayoutDashboard, LogOut, Menu, Search, UsersRound } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../ui/Logo'

const nav = [
  { to: '/admin/dashboard', label: 'Visão geral', icon: LayoutDashboard },
  { to: '/admin/contents', label: 'Conteúdos', icon: FileStack },
  { to: '/admin/calendar', label: 'Calendário', icon: CalendarDays },
  { to: '/admin/clients', label: 'Clientes', icon: UsersRound },
]

export default function AdminLayout() {
  const { adminUser, adminLogout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const logout = () => { adminLogout(); navigate('/admin/login') }
  const adminName = adminUser?.name || 'Bianca Mendes'
  const initials = adminName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className={`admin-shell ${menuOpen ? 'menu-open' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-brand"><Logo /><span>ADMIN</span></div>
        <div className="admin-workspace"><span className="avatar brand-avatar">CL</span><div><strong>Clarifi Agência</strong><small>Operação de conteúdo</small></div></div>
        <nav>{nav.map(({ to, label, icon: Icon }) => <NavLink to={to} onClick={() => setMenuOpen(false)} key={to}><Icon /><span>{label}</span></NavLink>)}</nav>
        <button className="admin-logout" onClick={logout}><LogOut /><span>Sair</span></button>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="icon-button admin-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu"><Menu /></button>
          <label><Search /><input placeholder="Buscar na operação…" /></label>
          <div><NavLink className="admin-client-portal" to="/dashboard">Portal do cliente</NavLink><button className="icon-button" aria-label="Notificações"><Bell /></button><div className="admin-header-user"><span className="avatar">{initials}</span><span><strong>{adminName}</strong><small>Administrador</small></span></div></div>
        </header>
        <main className="admin-content"><Outlet /></main>
      </div>
      {menuOpen && <button className="admin-menu-backdrop" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" />}
    </div>
  )
}
