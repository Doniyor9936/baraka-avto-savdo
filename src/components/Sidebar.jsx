import { useState } from 'react'
import { T } from '../utils/theme'
import logo from '/logo.jpg'

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',      icon: '◈',  adminOnly: false },
  { id: 'cars',       label: 'Mashinalar',      icon: '🚗', adminOnly: false },
  { id: 'sold',       label: 'Sotilganlar',     icon: '✅', adminOnly: false },
  { id: 'expenses',   label: 'Xarajatlar',      icon: '📉', adminOnly: false },
  { id: 'employees',  label: 'Xodimlar',        icon: '👥', adminOnly: false },
  { id: 'reports',    label: 'Hisobotlar',      icon: '📊', adminOnly: true  },
  { id: 'audit',      label: 'Audit Log',       icon: '🔍', adminOnly: true  },
  { id: 'settings',   label: 'Sozlamalar',      icon: '⚙️', adminOnly: false },
]

export default function Sidebar({ page, setPage, currentUser, onLogout }) {
  const [collapsed, setCollapsed] = useState(false)
  const isAdmin = currentUser.role === 'admin'
  const items = NAV_ITEMS.filter(x => !x.adminOnly || isAdmin)

  return (
    <div style={{
      width: collapsed ? 58 : 230,
      background: T.surface,
      borderRight: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width .2s',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 12px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#fff' }}>
          <img src={logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: T.gold, fontWeight: 900, fontSize: 13, lineHeight: 1.1, whiteSpace: 'nowrap', letterSpacing: -.3 }}>Baraka Avto</div>
            <div style={{ color: T.accent, fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: .5 }}>SAVDO CRM</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 6px', overflowY: 'auto' }}>
        {items.map(item => {
          const active = page === item.id
          return (
            <button key={item.id} className="nav-btn" onClick={() => setPage(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 9,
              padding: '9px 10px', borderRadius: 10, border: 'none', cursor: 'pointer',
              marginBottom: 2, textAlign: 'left', background: active ? T.accent + '22' : 'transparent',
              color: active ? T.accent : T.muted, fontWeight: active ? 700 : 500,
              fontSize: 13, transition: 'all .15s', whiteSpace: 'nowrap', overflow: 'hidden',
              position: 'relative',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {active && <span style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: T.accent, borderRadius: '0 2px 2px 0' }} />}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '10px 6px', borderTop: `1px solid ${T.border}` }}>
        {!collapsed && (
          <div style={{ background: T.card, borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ color: T.text, fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{currentUser.name}</div>
            <div style={{ color: isAdmin ? T.gold : T.accent, fontSize: 11, fontWeight: 700 }}>{isAdmin ? '👑 Admin' : '👤 Xodim'}</div>
          </div>
        )}
        <button onClick={() => setCollapsed(s => !s)} style={{ width: '100%', background: 'none', border: 'none', color: T.muted, cursor: 'pointer', padding: '8px 10px', borderRadius: 10, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span>{collapsed ? '▶' : '◀'}</span>
        </button>
        <button onClick={onLogout} style={{ width: '100%', background: 'none', border: 'none', color: T.red, cursor: 'pointer', padding: '8px 10px', borderRadius: 10, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', fontWeight: 600 }}>
          <span>🚪</span>{!collapsed && 'Chiqish'}
        </button>
      </div>
    </div>
  )
}
