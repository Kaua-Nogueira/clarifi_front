import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CalendarPage from './pages/CalendarPage'
import ContentPage from './pages/ContentPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminContentsPage from './pages/admin/AdminContentsPage'
import AdminContentFormPage from './pages/admin/AdminContentFormPage'
import AdminClientsPage from './pages/admin/AdminClientsPage'
import AdminCalendarPage from './pages/admin/AdminCalendarPage'

function ProtectedRoute({ children }) {
  return useAuth().isAuthenticated ? children : <Navigate to="/login" replace />
}

function AdminProtectedRoute({ children }) {
  return useAuth().isAdminAuthenticated ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="contents" element={<AdminContentsPage />} />
        <Route path="contents/new" element={<AdminContentFormPage />} />
        <Route path="contents/:id/edit" element={<AdminContentFormPage />} />
        <Route path="clients" element={<AdminClientsPage />} />
        <Route path="calendar" element={<AdminCalendarPage />} />
      </Route>
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="contents/:slug" element={<ContentPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
