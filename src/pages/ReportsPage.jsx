import { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import * as XLSX from 'xlsx'
import { useApp } from '../context/AppContext'
import { T } from '../utils/theme'
import { fmtSum, fmtDate } from '../utils/helpers'
import { Btn, StatCard, PageHeader, TableWrap } from '../components/UI'

const MONTH_NAMES = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']

export default function ReportsPage() {
  const { cars, expenses, users, currentUser } = useApp()
  const pieRef = useRef(null)
  const pieInst = useRef(null)
  const [year, setYear] = useState('2024')
  const [month, setMonth] = useState('')

  if (currentUser.role !== 'admin') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
        <h2 style={{ color: T.text, marginBottom: 8 }}>Kirish taqiqlangan</h2>
        <p style={{ color: T.muted }}>Hisobotlar faqat Admin uchun</p>
      </div>
    </div>
  )

  const soldCars = cars.filter(c => !c.deleted && c.status === 'Sotilgan')
  const activeExp = expenses.filter(e => !e.deleted)

  const filterDate = (items, key) => items.filter(item => {
    const d = new Date(item[key])
    if (year && d.getFullYear() !== Number(year)) return false
    if (month && d.getMonth() !== Number(month) - 1) return false
    return true
  })

  const fSales = filterDate(soldCars, 'soldDate')
  const fExp = filterDate(activeExp, 'date')

  const totalRev = fSales.reduce((a, c) => a + c.sellPrice, 0)
  const totalCost = fSales.reduce((a, c) => a + c.buyPrice, 0)
  const totalExpSum = fExp.reduce((a, e) => a + e.amount, 0)
  const grossP = totalRev - totalCost
  const netP = grossP - totalExpSum

  const empStats = users.filter(u => u.role === 'xodim').map(u => {
    const sales = fSales.filter(c => c.soldById === u.id)
    const refs = fSales.filter(c => c.referralId === u.id)
    const rev = sales.reduce((a, c) => a + c.sellPrice, 0)
    const profit = sales.reduce((a, c) => a + (c.sellPrice - c.buyPrice), 0)
    return { ...u, sales: sales.length, refs: refs.length, revenue: rev, profit }
  })

  const expByType = {}
  fExp.forEach(e => { expByType[e.type] = (expByType[e.type] || 0) + e.amount })

  useEffect(() => {
    if (!pieRef.current || !Object.keys(expByType).length) return
    if (pieInst.current) pieInst.current.destroy()
    pieInst.current = new Chart(pieRef.current, {
      type: 'doughnut',
      data: {
        labels: Object.keys(expByType),
        datasets: [{ data: Object.values(expByType), backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'], borderWidth: 0 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 }, padding: 12 } } } }
    })
  }, [cars, expenses, year, month])

  const exportExcel = (type) => {
    const wb = XLSX.utils.book_new()
    const title = `${year}${month ? '-' + String(month).padStart(2, '0') : ''}`

    if (type === 'all' || type === 'sales') {
      const rows = fSales.map(c => ({
        'Mashina': `${c.brand} ${c.model} ${c.year}`,
        "Kirish narxi (so'm)": c.buyPrice,
        "Sotuv narxi (so'm)": c.sellPrice,
        "Foyda (so'm)": c.sellPrice - c.buyPrice,
        'Sotilgan sana': c.soldDate || '',
        'Referal': users.find(u => u.id === c.referralId)?.name || '',
        'Sotuvchi': users.find(u => u.id === c.soldById)?.name || '',
      }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Sotuvlar')
    }
    if (type === 'all' || type === 'expenses') {
      const rows = fExp.map(e => ({ 'Nomi': e.name, 'Turi': e.type, "Summa (so'm)": e.amount, 'Sana': e.date, 'Izoh': e.note }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Xarajatlar')
    }
    if (type === 'all' || type === 'employees') {
      const rows = empStats.map(u => ({ 'Xodim': u.name, 'Sotuvlar': u.sales, 'Referallar': u.refs, "Tushum (so'm)": u.revenue, "Foyda (so'm)": u.profit }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Xodimlar')
    }
    const summary = [
      { "Ko'rsatkich": 'Jami sotuvlar', 'Qiymat': fSales.length },
      { "Ko'rsatkich": "Jami tushum (so'm)", 'Qiymat': totalRev },
      { "Ko'rsatkich": "Xarajatlar (so'm)", 'Qiymat': totalExpSum },
      { "Ko'rsatkich": "Brutto foyda (so'm)", 'Qiymat': grossP },
      { "Ko'rsatkich": "Sof foyda (so'm)", 'Qiymat': netP },
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Xulosa')
    XLSX.writeFile(wb, `BarakaAvto_Hisobot_${title}.xlsx`)
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="📊 Hisobotlar"
        sub="Moliyaviy tahlil — faqat Admin"
        right={<>
          <Btn variant='success' onClick={() => exportExcel('all')}>⬇️ Barchasi Excel</Btn>
          <Btn variant='ghost' onClick={() => exportExcel('sales')}>📊 Sotuvlar</Btn>
          <Btn variant='ghost' onClick={() => exportExcel('expenses')}>📉 Xarajatlar</Btn>
          <Btn variant='ghost' onClick={() => exportExcel('employees')}>👥 Xodimlar</Btn>
        </>}
      />

      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
        <select value={year} onChange={e => setYear(e.target.value)} style={{ background: T.card, border: `1px solid ${T.border}`, color: T.text, padding: '10px 14px', borderRadius: 10, fontSize: 13, outline: 'none' }}>
          {['2022', '2023', '2024', '2025'].map(y => <option key={y} value={y}>{y} yil</option>)}
        </select>
        <select value={month} onChange={e => setMonth(e.target.value)} style={{ background: T.card, border: `1px solid ${T.border}`, color: T.text, padding: '10px 14px', borderRadius: 10, fontSize: 13, outline: 'none' }}>
          <option value=''>Barcha oylar</option>
          {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
        <StatCard icon="🛒" label="Sotuvlar soni" value={fSales.length} color={T.cyan} />
        <StatCard icon="💰" label="Jami Tushum" value={fmtSum(totalRev)} color={T.gold} />
        <StatCard icon="📦" label="Kirish Narxi" value={fmtSum(totalCost)} color={T.soft} />
        <StatCard icon="📉" label="Xarajatlar" value={fmtSum(totalExpSum)} color={T.red} />
        <StatCard icon="📈" label="Brutto Foyda" value={fmtSum(grossP)} color={T.cyan} />
        <StatCard icon="🏆" label="Sof Foyda" value={fmtSum(netP)} color={netP >= 0 ? T.green : T.red} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
          <div style={{ color: T.text, fontWeight: 700, marginBottom: 16, fontSize: 15 }}>👥 Xodimlar Kesimida</div>
          <TableWrap
            headers={['Xodim', 'Sotuvlar', 'Referallar', 'Tushum', 'Foyda']}
            rows={empStats.map((u) => (
              <tr key={u.id} className="hover-row" style={{ borderTop: `1px solid ${T.border}` }}>
                <td style={{ padding: '10px 14px', color: T.text, fontWeight: 700 }}>{u.name}</td>
                <td style={{ padding: '10px 14px', color: T.accent, fontWeight: 700 }}>{u.sales}</td>
                <td style={{ padding: '10px 14px', color: T.purple, fontWeight: 700 }}>{u.refs}</td>
                <td style={{ padding: '10px 14px', color: T.gold, fontSize: 12 }}>{fmtSum(u.revenue)}</td>
                <td style={{ padding: '10px 14px', color: T.green, fontSize: 12 }}>{fmtSum(u.profit)}</td>
              </tr>
            ))}
          />
        </div>

        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
          <div style={{ color: T.text, fontWeight: 700, marginBottom: 16, fontSize: 15 }}>📉 Xarajat Taqsimoti</div>
          {Object.keys(expByType).length > 0
            ? <div style={{ height: 220 }}><canvas ref={pieRef} /></div>
            : <div style={{ color: T.muted, textAlign: 'center', padding: 40 }}>Ma'lumot yo'q</div>
          }
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
        <div style={{ color: T.text, fontWeight: 700, marginBottom: 16, fontSize: 15 }}>🔗 Referal Kesimida</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {empStats.filter(u => u.refs > 0).map(u => (
            <div key={u.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 160 }}>
              <div style={{ color: T.text, fontWeight: 800 }}>{u.name}</div>
              <div style={{ color: T.purple, fontSize: 28, fontWeight: 900, marginTop: 4 }}>{u.refs}</div>
              <div style={{ color: T.muted, fontSize: 12 }}>referal sotuv</div>
              <div style={{ color: T.gold, fontSize: 13, fontWeight: 600, marginTop: 4 }}>{fmtSum(u.profit)} foyda</div>
            </div>
          ))}
          {empStats.every(u => u.refs === 0) && <p style={{ color: T.muted, padding: 20 }}>Hali referal yo'q</p>}
        </div>
      </div>
    </div>
  )
}
