import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/admin/AdminLayout'
import EmployeeLayout from './components/employee/EmployeeLayout'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage'
import AdminEmployeesPage from './pages/admin/AdminEmployeesPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import DashboardPage from './pages/DashboardPage'
import RecordsPage from './pages/RecordsPage'
import AttendancePage from './pages/AttendancePage'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import EmployeeHistory from './pages/employee/EmployeeHistory'
import EmployeeProfile from './pages/employee/EmployeeProfile'
import LoginPage from './pages/LoginPage'
import './App.css'

function RoleGate({ allowedRole, role, children }) {
  return role === allowedRole ? children : <Navigate to={role === 'admin' ? '/admin' : '/employee'} replace />
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('attendance-auth') === 'true')
  const [role, setRole] = useState(() => localStorage.getItem('attendance-demo-role') || 'employee')
  const handleLogin = (selectedRole) => { localStorage.setItem('attendance-auth', 'true'); localStorage.setItem('attendance-demo-role', selectedRole); setRole(selectedRole); setIsAuthenticated(true) }
  const handleLogout = () => { localStorage.removeItem('attendance-auth'); localStorage.removeItem('attendance-demo-role'); setIsAuthenticated(false) }
  const home = role === 'admin' ? '/admin' : '/employee'
  return <BrowserRouter><Routes>
    <Route path="/login" element={isAuthenticated ? <Navigate to={home} replace /> : <LoginPage onLogin={handleLogin} />} />
    <Route path="/" element={<Navigate to={isAuthenticated ? home : '/login'} replace />} />
    <Route element={isAuthenticated ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
      <Route path="/admin" element={<RoleGate allowedRole="admin" role={role}><DashboardPage /></RoleGate>} />
      <Route path="/admin/employees" element={<RoleGate allowedRole="admin" role={role}><AdminEmployeesPage /></RoleGate>} />
      <Route path="/admin/records" element={<RoleGate allowedRole="admin" role={role}><RecordsPage /></RoleGate>} />
      <Route path="/admin/analytics" element={<RoleGate allowedRole="admin" role={role}><AdminAnalyticsPage /></RoleGate>} />
      <Route path="/admin/reports" element={<RoleGate allowedRole="admin" role={role}><AdminReportsPage /></RoleGate>} />
    </Route>
    <Route element={isAuthenticated ? <EmployeeLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
      <Route path="/employee" element={<RoleGate allowedRole="employee" role={role}><EmployeeDashboard /></RoleGate>} />
      <Route path="/employee/attendance" element={<RoleGate allowedRole="employee" role={role}><AttendancePage /></RoleGate>} />
      <Route path="/employee/history" element={<RoleGate allowedRole="employee" role={role}><EmployeeHistory /></RoleGate>} />
      <Route path="/employee/profile" element={<RoleGate allowedRole="employee" role={role}><EmployeeProfile /></RoleGate>} />
    </Route>
    <Route path="*" element={<Navigate to={home} replace />} />
  </Routes></BrowserRouter>
}
