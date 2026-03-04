import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { useApp } from '../context/AppContext'
import { T } from '../utils/theme'
import { fmtSum, fmtDate } from '../utils/helpers'
import { StatCard, PageHeader, TableWrap } from '../components/UI'

export default function Dashboard() {
  const { cars, expenses, users } = useApp()
  const chartRef = useRef(null)
  const chartInst = useRef(null)

  const activeCars = cars.filter(c => !c.deleted)
  const soldCars = activeCars.filter(c => c.status === 'Sotilgan')
  const onSale = activeCars.filter(c => c.status === 'Sotuvda')
  const totalRevenue = soldCars.reduce((a, c) => a + c.sellPrice, 0)
  const totalCost = soldCars.reduce((a, c) => a + c.buyPrice, 0)
  const totalExp = expenses.filter(e => !e.deleted).reduce((a, e) => a + e.amount, 0)
  const grossProfit = totalRevenue - totalCost
  const netProfit = grossProfit - totalExp

  const refStats = {}
  soldCars.forEach(c => { if (c.referralId) refStats[c.referralId] = (refStats[c.referralId] || 0) + 1 })
  const bestRefId = Object.keys(refStats).sort((a, b) => refStats[b] - refStats[a])[0]
  const bestRef = users.find(u => u.id === Number(bestRefId))

  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Nov', 'Dek']
  const monthlyData = months.map((_, mi) => {
    const mc = soldCars.filter(c => {
      if (!c.soldDate) return false
      const d = new Date(c.soldDate)
      return d.getMonth() === mi && d.getFullYear() === 2024
    })
    return { sales: mc.length, revenue: mc.reduce((a, c) => a + c.sellPrice, 0) }
  })

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInst.current) chartInst.current.destroy()
    chartInst.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Sotuvlar', data: monthlyData.map(d => d.sales),
            backgroundColor: '#3b82f635', borderColor: '#3b82f6', borderWidth: 2, borderRadius: 6, yAxisID: 'y1'
          },
          {
            label: "Tushum (mln so'm)", data: monthlyData.map(d => d.revenue / 1_000_000),
            type: 'line', borderColor: '#f59e0b', backgroundColor: '#f59e0b15',
            borderWidth: 2.5, fill: true, tension: .4, pointBackgroundColor: '#f59e0b', pointRadius: 4, yAxisID: 'y'
          },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 12 } } } },
        scales: {
          x: { ticks: { color: '#64748b' }, grid: { color: '#1a2d4a20' } },
          y: { ticks: { color: '#64748b', callback: v => v + 'M' }, grid: { color: '#1a2d4a40' } },
          y1: { position: 'right', ticks: { color: '#64748b' }, grid: { drawOnChartArea: false } }
        }
      }
    })
  }, [cars])

  const recent = soldCars.sort((a, b) => new Date(b.soldDate) - new Date(a.soldDate)).slice(0, 5)

  return (
    <div className="fade-in">
      <PageHeader title="📊 Dashboard" sub="Real vaqt umumiy ko'rsatkichlar" />

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatCard icon="🚗" label="Jami Mashinalar" value={activeCars.length} sub={`${onSale.length} sotuvda`} color={T.cyan} />
        <StatCard icon="✅" label="Sotilgan" value={soldCars.length} color={T.green} />
        <StatCard icon="💰" label="Jami Tushum" value={fmtSum(totalRevenue)} color={T.gold} />
        <StatCard icon="📉" label="Xarajatlar" value={fmtSum(totalExp)} color={T.red} />
        <StatCard icon="🏆" label="Sof Foyda" value={fmtSum(netProfit)} color={netProfit >= 0 ? T.green : T.red} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18, marginBottom: 18 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
          <div style={{ color: T.text, fontWeight: 700, marginBottom: 16, fontSize: 15 }}>📈 Oylik Sotuv & Tushum (2024)</div>
          <div style={{ height: 240 }}><canvas ref={chartRef} /></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, flex: 1 }}>
            <div style={{ color: T.text, fontWeight: 700, marginBottom: 14, fontSize: 15 }}>🏆 Eng Faol Xodim</div>
            {bestRef ? <>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: T.gold + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 10 }}>{bestRef.name.charAt(0)}</div>
              <div style={{ color: T.text, fontWeight: 800, fontSize: 16 }}>{bestRef.name}</div>
              <div style={{ color: T.gold, fontSize: 13, marginTop: 3 }}>{refStats[bestRefId]} ta referal</div>
            </> : <div style={{ color: T.muted }}>Ma'lumot yo'q</div>}
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { l: 'Brutto', v: fmtSum(grossProfit), c: T.green },
                { l: 'Xarajat', v: fmtSum(totalExp), c: T.red },
                { l: 'Sotuv', v: fmtSum(totalRevenue), c: T.accent },
                { l: 'Kirish', v: fmtSum(totalCost), c: T.muted },
              ].map(x => (
                <div key={x.l} style={{ background: T.surface, borderRadius: 10, padding: 10 }}>
                  <div style={{ color: T.muted, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{x.l}</div>
                  <div style={{ color: x.c, fontWeight: 800, fontSize: 13, marginTop: 3, lineHeight: 1.3 }}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
        <div style={{ color: T.text, fontWeight: 700, marginBottom: 14, fontSize: 15 }}>🕐 So'nggi Sotuvlar</div>
        <TableWrap
          headers={['Mashina', 'Sotuvchi', 'Sana', 'Sotuv narxi', 'Foyda']}
          rows={recent.map((c, i) => {
            const seller = users.find(u => u.id === c.soldById)
            return (
              <tr key={c.id} className="hover-row" style={{ borderTop: `1px solid ${T.border}`, background: i % 2 ? '#ffffff03' : 'transparent' }}>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ color: T.text, fontWeight: 700 }}>{c.brand} {c.model}</div>
                  <div style={{ color: T.muted, fontSize: 12 }}>{c.year}</div>
                </td>
                <td style={{ padding: '11px 14px', color: T.soft, fontSize: 13 }}>{seller?.name || '-'}</td>
                <td style={{ padding: '11px 14px', color: T.muted, fontSize: 12 }}>{fmtDate(c.soldDate)}</td>
                <td style={{ padding: '11px 14px', color: T.gold, fontWeight: 700, fontSize: 13 }}>{fmtSum(c.sellPrice)}</td>
                <td style={{ padding: '11px 14px', color: T.green, fontWeight: 700, fontSize: 13 }}>{fmtSum(c.sellPrice - c.buyPrice)}</td>
              </tr>
            )
          })}
        />
      </div>
    </div>
  )
}
