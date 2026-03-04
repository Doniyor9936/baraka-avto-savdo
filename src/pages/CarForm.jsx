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

export default CarForm