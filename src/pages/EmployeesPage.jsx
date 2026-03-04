import { useApp } from '../context/AppContext'
import { T } from '../utils/theme'
import { fmtSum } from '../utils/helpers'
import { Badge, PageHeader } from '../components/UI'

export default function EmployeesPage() {
  const { users, cars, currentUser } = useApp()

  const getStats = (uid) => {
    const sold = cars.filter(c => !c.deleted && c.status === 'Sotilgan')
    const mySales = sold.filter(c => c.soldById === uid)
    const myRefs = sold.filter(c => c.referralId === uid)
    const revenue = mySales.reduce((a, c) => a + c.sellPrice, 0)
    const grossP = mySales.reduce((a, c) => a + (c.sellPrice - c.buyPrice), 0)
    return { sales: mySales.length, refs: myRefs.length, revenue, grossP }
  }

  return (
    <div className="fade-in">
      <PageHeader title="👥 Xodimlar" sub={`${users.filter(u => u.active && u.role === 'xodim').length} ta faol xodim`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {users.map(u => {
          const s = getStats(u.id)
          const pct = u.role === 'xodim' ? Math.min(100, (s.sales / 10) * 100) : 100
          return (
            <div key={u.id} style={{ background: T.card, border: `1px solid ${u.id === currentUser.id ? T.accent : T.border}`, borderRadius: 16, padding: 22, opacity: u.active ? 1 : .55 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: (u.role === 'admin' ? T.gold : T.accent) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: u.role === 'admin' ? T.gold : T.accent }}>
                  {u.name.charAt(0)}
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <Badge text={u.role === 'admin' ? 'Admin' : 'Xodim'} color={u.role === 'admin' ? 'yellow' : 'blue'} />
                  <Badge text={u.active ? 'Faol' : 'Passiv'} color={u.active ? 'green' : 'gray'} />
                  {u.id === currentUser.id && <Badge text="Siz" color='cyan' />}
                </div>
              </div>

              <div style={{ color: T.text, fontWeight: 800, fontSize: 16, marginBottom: 2 }}>{u.name}</div>
              <div style={{ color: T.muted, fontSize: 12, marginBottom: 16 }}>Login: {u.login}</div>

              {u.role === 'xodim' && <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                  {[
                    { l: 'Sotuvlar', v: s.sales, c: T.accent },
                    { l: 'Referallar', v: s.refs, c: T.purple },
                    { l: 'Tushum', v: fmtSum(s.revenue), c: T.gold },
                    { l: 'Foyda', v: fmtSum(s.grossP), c: T.green },
                  ].map(x => (
                    <div key={x.l} style={{ background: T.surface, borderRadius: 8, padding: '8px 10px' }}>
                      <div style={{ color: T.muted, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{x.l}</div>
                      <div style={{ color: x.c, fontWeight: 800, fontSize: 13, marginTop: 2 }}>{x.v}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: T.muted, fontSize: 11 }}>Oylik plan: {s.sales}/10</span>
                    <span style={{ color: pct >= 100 ? T.green : T.accent, fontSize: 11, fontWeight: 700 }}>{Math.round(pct)}%</span>
                  </div>
                  <div style={{ background: T.border, borderRadius: 99, height: 5 }}>
                    <div style={{ background: pct >= 100 ? T.green : T.accent, width: `${pct}%`, height: '100%', borderRadius: 99, transition: 'width .5s' }} />
                  </div>
                </div>
              </>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
