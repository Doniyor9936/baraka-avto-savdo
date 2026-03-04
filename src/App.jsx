import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { T } from './utils/theme'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import CarsPage from './pages/CarsPage'
import ExpensesPage from './pages/ExpensesPage'
import EmployeesPage from './pages/EmployeesPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import AuditPage from './pages/AuditPage'
import Sidebar from './components/Sidebar'

function MainApp() {
  const { currentUser, setCurrentUser, users } = useApp()
  const [page, setPage] = useState('dashboard')

  if (!currentUser) {
    return <LoginPage onLogin={u => { setCurrentUser(u); setPage('dashboard') }} users={users} />
  }

  const pages = {
    dashboard: <Dashboard />,
    cars:      <CarsPage />,
    sold:      <CarsPage sold />,
    expenses:  <ExpensesPage />,
    employees: <EmployeesPage />,
    reports:   <ReportsPage />,
    audit:     <AuditPage />,
    settings:  <SettingsPage />,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: T.bg, overflow: 'hidden' }}>
      <Sidebar
        page={page}
        setPage={setPage}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {pages[page] || <Dashboard />}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  )
}
