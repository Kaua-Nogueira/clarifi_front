import { CalendarDays, FileCheck2, LayoutDashboard } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return <nav className="bottom-nav"><NavLink to="/dashboard"><LayoutDashboard /><span>Início</span></NavLink><NavLink to="/calendar"><CalendarDays /><span>Agenda</span></NavLink><NavLink to="/contents/festival-de-massas"><FileCheck2 /><span>Revisar</span></NavLink></nav>
}
