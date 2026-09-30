import { CalendarDays, CircleHelp, FileCheck2, LayoutDashboard, LogOut, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../ui/Logo'

const nav = [
  { to: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
  { to: '/calendar', label: 'Calendário', icon: CalendarDays },
  { to: '/contents/festival-de-massas', label: 'Conteúdos', icon: FileCheck2 },
]

export default function Sidebar() {
  const { logout } = useAuth()
  return (
    <aside className="sidebar">
      <Logo />
      <div className="workspace-switch"><span className="avatar brand-avatar">SV</span><div><strong>Sabor da Vila</strong><small>Portal do cliente</small></div><span>⌄</span></div>
      <nav className="side-nav">{nav.map(({ to, label, icon: Icon }) => <NavLink to={to} key={to}><Icon size={19} /><span>{label}</span></NavLink>)}</nav>
      <div className="side-nav side-nav-bottom">
        <a href="#ajuda"><CircleHelp size={19} /><span>Central de ajuda</span></a>
        <a href="#config"><Settings size={19} /><span>Configurações</span></a>
        <button onClick={logout}><LogOut size={19} /><span>Sair</span></button>
      </div>
      <div className="sidebar-user"><span className="avatar">MC</span><div><strong>Marina Costa</strong><small>Cliente</small></div></div>
    </aside>
  )
}
