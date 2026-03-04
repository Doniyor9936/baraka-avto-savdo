import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { T } from '../utils/theme'
import { fmtSum, fmtDate, uid } from '../utils/helpers'
import { Btn, Inp, Modal, Confirm, Badge, PageHeader, TableWrap } from '../components/UI'

function CarForm({ initial, onSave, onClose }) {
  const { users } = useApp()
  const empty = { brand: '', model: '', year: new Date().getFullYear(), color: '', bodyType: '', fuelType: '', mileage: 0, buyPrice: '', sellPrice: '', arrivedDate: new Date().toISOString().split('T')[0], status: 'Sotuvda', referralId: '', soldDate: '', note: '' }
  const [f, setF] = useState(initial ? { ...initial } : empty)
  const [errs, setErrs] = useState({})
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!f.brand.trim()) e.brand = 'Marka majburiy'
    if (!f.model.trim()) e.model = 'Model majburiy'
    if (!f.buyPrice) e.buyPrice = 'Kirish narxi majburiy'
    if (!f.sellPrice) e.sellPrice = 'Sotuv narxi majburiy'
    setErrs(e)
    return !Object.keys(e).length
  }

  const save = () => {
    if (!validate()) return
    onSave({
      ...f,
      buyPrice: Number(f.buyPrice), sellPrice: Number(f.sellPrice),
      mileage: Number(f.mileage) || 0, year: Number(f.year),
      referralId: f.referralId ? Number(f.referralId) : null,
      soldDate: f.status === 'Sotilgan' ? (f.soldDate || new Date().toISOString().split('T')[0]) : null
    })
  }

  const xodimlar = users.filter(u => u.role === 'xodim' && u.active)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Inp label="Marka" value={f.brand} onChange={v => set('brand', v)} required error={errs.brand} />
        <Inp label="Model" value={f.model} onChange={v => set('model', v)} required error={errs.model} />
        <Inp label="Yil" value={f.year} onChange={v => set('year', v)} type="number" />
        <Inp label="Rang" value={f.color} onChange={v => set('color', v)} options={["Oq", "Qora", "Kumush", "Qizil", "Ko'k", "Yashil", "Sariq", "Jigarrang", "Boshqa"]} />
        <Inp label="Kuzov turi" value={f.bodyType} onChange={v => set('bodyType', v)} options={['Sedan', 'SUV', 'Hatchback', 'Minivan', 'Pickup', 'Coupe']} />
        <Inp label="Yoqilg'i" value={f.fuelType} onChange={v => set('fuelType', v)} options={['Benzin', 'Dizel', 'Gaz', 'Elektr', 'Gibrid']} />
        <Inp label="Probeg (km)" value={f.mileage} onChange={v => set('mileage', v)} type="number" />
        <Inp label="Kelgan sana" value={f.arrivedDate} onChange={v => set('arrivedDate', v)} type="date" />
        <Inp label="Kirish narxi (so'm)" value={f.buyPrice} onChange={v => set('buyPrice', v)} type="number" required error={errs.buyPrice} placeholder="masalan: 350000000" />
        <Inp label="Sotuv narxi (so'm)" value={f.sellPrice} onChange={v => set('sellPrice', v)} type="number" required error={errs.sellPrice} placeholder="masalan: 420000000" />
        <Inp label="Status" value={f.status} onChange={v => set('status', v)} options={['Sotuvda', 'Sotilgan']} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', color: T.soft, fontSize: 12, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: .5 }}>Referal xodim</label>
          <select value={f.referralId || ''} onChange={e => set('referralId', e.target.value)} style={{ width: '100%', background: T.card, border: `1px solid ${T.border}`, color: T.text, padding: '10px 13px', borderRadius: 10, fontSize: 14, outline: 'none' }}>
            <option value=''>— Tanlang —</option>
            {xodimlar.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>
      {f.status === 'Sotilgan' && <Inp label="Sotilgan sana" value={f.soldDate || ''} onChange={v => set('soldDate', v)} type="date" />}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
        <Btn variant='ghost' onClick={onClose}>Bekor</Btn>
        <Btn onClick={save}>💾 Saqlash</Btn>
      </div>
    </div>
  )
}

export default function CarsPage({ sold = false }) {
  const { cars, setCars, users, currentUser, addAudit } = useApp()
  const [modal, setModal] = useState(false)
  const [editCar, setEditCar] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch] = useState('')
  const [fUser, setFUser] = useState('')
  const [fStatus, setFStatus] = useState('')

  const visible = cars.filter(c => {
    if (c.deleted) return false
    if (sold && c.status !== 'Sotilgan') return false
    if (!sold && c.status === 'Sotilgan') return false
    if (fUser && String(c.referralId) !== fUser) return false
    if (fStatus && c.status !== fStatus) return false
    const q = search.toLowerCase()
    return !q || `${c.brand} ${c.model} ${c.year} ${c.color}`.toLowerCase().includes(q)
  })

  const save = (data) => {
    if (editCar) {
      setCars(p => p.map(c => c.id === editCar.id ? { ...c, ...data } : c))
      addAudit(currentUser, 'Mashina tahrirlandi', `${data.brand} ${data.model}`)
    } else {
      setCars(p => [...p, { ...data, id: uid(), deleted: false, soldById: data.status === 'Sotilgan' ? currentUser.id : null }])
      addAudit(currentUser, "Mashina qo'shildi", `${data.brand} ${data.model}`)
    }
    setModal(false); setEditCar(null)
  }

  const del = (id) => {
    const c = cars.find(x => x.id === id)
    setCars(p => p.map(x => x.id === id ? { ...x, deleted: true } : x))
    addAudit(currentUser, "Mashina o'chirildi", `${c?.brand} ${c?.model}`)
    setConfirm(null)
  }

  const markSold = (car) => {
    setCars(p => p.map(c => c.id === car.id ? { ...c, status: 'Sotilgan', soldDate: new Date().toISOString().split('T')[0], soldById: currentUser.id } : c))
    addAudit(currentUser, 'Mashina sotildi', `${car.brand} ${car.model}`)
  }

  const xodimlar = users.filter(u => u.role === 'xodim')

  return (
    <div className="fade-in">
      <PageHeader
        title={sold ? '✅ Sotilgan Mashinalar' : '🚗 Mashinalar'}
        sub={`${visible.length} ta mashina`}
        right={!sold && <Btn onClick={() => { setEditCar(null); setModal(true) }}>+ Yangi Mashina</Btn>}
      />

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Qidirish (marka, model, yil)..." style={{ flex: 1, minWidth: 180, background: T.card, border: `1px solid ${T.border}`, color: T.text, padding: '10px 14px', borderRadius: 10, fontSize: 13, outline: 'none' }} />
        {!sold && (
          <select value={fStatus} onChange={e => setFStatus(e.target.value)} style={{ background: T.card, border: `1px solid ${T.border}`, color: T.text, padding: '10px 13px', borderRadius: 10, fontSize: 13, outline: 'none' }}>
            <option value=''>Barcha status</option>
            <option value='Sotuvda'>Sotuvda</option>
            <option value='Sotilgan'>Sotilgan</option>
          </select>
        )}
        <select value={fUser} onChange={e => setFUser(e.target.value)} style={{ background: T.card, border: `1px solid ${T.border}`, color: T.text, padding: '10px 13px', borderRadius: 10, fontSize: 13, outline: 'none' }}>
          <option value=''>Barcha referal</option>
          {xodimlar.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>

      <TableWrap
        headers={['Mashina', 'Status', 'Kirish narxi', 'Sotuv narxi', sold ? 'Foyda' : 'Probeg', 'Referal', sold ? 'Sotilgan' : 'Kelgan', 'Amallar']}
        rows={visible.map((c, i) => {
          const ref = users.find(u => u.id === c.referralId)
          const profit = c.sellPrice - c.buyPrice
          return (
            <tr key={c.id} className="hover-row" style={{ borderTop: `1px solid ${T.border}`, background: i % 2 ? '#ffffff03' : 'transparent' }}>
              <td style={{ padding: '12px 14px' }}>
                <div style={{ color: T.text, fontWeight: 700 }}>{c.brand} {c.model}</div>
                <div style={{ color: T.muted, fontSize: 12 }}>{c.year} · {c.color} · {c.fuelType}</div>
              </td>
              <td style={{ padding: '12px 14px' }}><Badge text={c.status} color={c.status === 'Sotuvda' ? 'blue' : 'green'} /></td>
              <td style={{ padding: '12px 14px', color: T.soft, fontSize: 13 }}>{fmtSum(c.buyPrice)}</td>
              <td style={{ padding: '12px 14px', color: T.gold, fontWeight: 700, fontSize: 13 }}>{fmtSum(c.sellPrice)}</td>
              <td style={{ padding: '12px 14px', color: sold ? (profit > 0 ? T.green : T.red) : T.soft, fontWeight: sold ? 700 : 400, fontSize: 13 }}>
                {sold ? fmtSum(profit) : `${(c.mileage || 0).toLocaleString()} km`}
              </td>
              <td style={{ padding: '12px 14px', color: T.soft, fontSize: 12 }}>{ref?.name || '—'}</td>
              <td style={{ padding: '12px 14px', color: T.muted, fontSize: 12 }}>{fmtDate(sold ? c.soldDate : c.arrivedDate)}</td>
              <td style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <Btn size='sm' variant='ghost' onClick={() => { setEditCar(c); setModal(true) }}>✏️</Btn>
                  {!sold && c.status === 'Sotuvda' && <Btn size='sm' variant='success' onClick={() => markSold(c)}>Sotildi</Btn>}
                  <Btn size='sm' variant='danger' onClick={() => setConfirm(c.id)}>🗑</Btn>
                </div>
              </td>
            </tr>
          )
        })}
      />

      {modal && (
        <Modal title={editCar ? 'Mashinani Tahrirlash' : "Yangi Mashina Qo'shish"} onClose={() => { setModal(false); setEditCar(null) }} width={640}>
          <CarForm initial={editCar} onSave={save} onClose={() => { setModal(false); setEditCar(null) }} />
        </Modal>
      )}
      {confirm && <Confirm message="Bu mashinani o'chirmoqchimisiz?" onYes={() => del(confirm)} onNo={() => setConfirm(null)} />}
    </div>
  )
}
