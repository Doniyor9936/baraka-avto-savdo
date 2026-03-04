import { useApp } from '../context/AppContext'
import { T } from '../utils/theme'
import { Badge, PageHeader, TableWrap } from '../components/UI'

export default function AuditPage() {
  const { audit, currentUser } = useApp()

  if (currentUser.role !== 'admin') return null

  return (
    <div className="fade-in">
      <PageHeader title="🔍 Audit Log" sub="Tizimda bajarilgan barcha amallar" />
      <TableWrap
        headers={['Foydalanuvchi', 'Amal', "Ob'ekt", 'Vaqt']}
        rows={[...audit].reverse().map((a, i) => (
          <tr key={a.id} className="hover-row" style={{ borderTop: `1px solid ${T.border}`, background: i % 2 ? '#ffffff03' : 'transparent' }}>
            <td style={{ padding: '12px 14px', color: T.text, fontWeight: 600 }}>{a.userName}</td>
            <td style={{ padding: '12px 14px' }}><Badge text={a.action} color='blue' /></td>
            <td style={{ padding: '12px 14px', color: T.soft, fontSize: 13 }}>{a.target}</td>
            <td style={{ padding: '12px 14px', color: T.muted, fontSize: 12 }}>{new Date(a.date).toLocaleString('uz-UZ')}</td>
          </tr>
        ))}
      />
    </div>
  )
}
