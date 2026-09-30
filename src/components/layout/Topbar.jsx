import { Bell, Menu, Search } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../ui/Logo'

export default function Topbar() {
  const { user } = useAuth()
  return (
    <header className="topbar">
      <div className="mobile-logo"><Logo compact /><strong>clarifi.</strong></div>
      <button className="mobile-menu icon-button" aria-label="Abrir menu"><Menu size={21} /></button>
      <label className="top-search"><Search size={18} /><input placeholder="Buscar conteúdos…" aria-label="Buscar conteúdos" /><kbd>⌘ K</kbd></label>
      <div className="top-actions"><button className="icon-button notification-button" aria-label="Notificações"><Bell size={19} /><span /></button><div className="top-user"><span className="avatar">MC</span><div><strong>{user?.name || 'Marina Costa'}</strong><small>Sabor da Vila</small></div></div></div>
    </header>
  )
}
