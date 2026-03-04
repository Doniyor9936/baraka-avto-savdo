import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { T } from '../utils/theme'
import { fmtSum, fmtDate, uid } from '../utils/helpers'
import { Btn, TableWrap, PageHeader, Confirm, Badge, Modal } from '../components/UI'
import CarForm from './CarForm'
import SaleModal from './SaleModal'
import SoldCarModal from './SoldCarModal'

export default function CarsPage({ sold = false }) {
  const { cars, setCars, users, currentUser, addAudit } = useApp()
  const [modal, setModal] = useState(false)
  const [editCar, setEditCar] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [saleModalCar, setSaleModalCar] = useState(null)
  const [soldModalCar, setSoldModalCar] = useState(null)
  const [search, setSearch] = useState('')
  const [fUser, setFUser] = useState('')
  const [fStatus, setFStatus] = useState('')

  const xodimlar = users.filter(u => u.role === 'xodim')

  const visible = cars.filter(c => {
    if (c.deleted) return false
    if (sold && c.status !== 'Sotilgan') return false
    if (!sold && c.status === 'Sotilgan') return false
    if (fUser && String(c.referralId) !== fUser) return false
    if (fStatus && c.status !== fStatus) return false
    const q = search.toLowerCase()
    return !q || `${c.brand} ${c.model} ${c.year} ${c.color}`.toLowerCase().includes(q)
  })

  const saveCar = (data) => {
    if (editCar) {
      setCars(p => p.map(c => c.id === editCar.id ? { ...c, ...data } : c))
      addAudit(currentUser, 'Mashina tahrirlandi', `${data.brand} ${data.model}`)
    } else {
      setCars(p => [...p, { ...data, id: uid(), deleted: false }])
      addAudit(currentUser, "Mashina qo'shildi", `${data.brand} ${data.model}`)
    }
    setModal(false); setEditCar(null)
  }

  const delCar = (id) => {
    const c = cars.find(x => x.id === id)
    setCars(p => p.map(x => x.id === id ? { ...x, deleted: true } : x))
    addAudit(currentUser, "Mashina o'chirildi", `${c?.brand} ${c?.model}`)
    setConfirm(null)
  }

  const handleShowSold = (car) => {
    const seller = users.find(u => u.id === car.soldById)
    setSoldModalCar({ ...car, soldByName: seller?.name })
  }

  return (
    <div className="fade-in">
      <PageHeader
        title={sold ? '✅ Sotilgan Mashinalar' : '🚗 Mashinalar'}
        sub={`${visible.length} ta mashina`}
        right={!sold && <Btn onClick={() => { setEditCar(null); setModal(true) }}>+ Yangi Mashina</Btn>}
      />

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Qidirish..."
          style={{ flex: 1, minWidth: 180, background: T.card, border: `1px solid ${T.border}`, color: T.text, padding: '10px 14px', borderRadius: 10, fontSize: 13, outline: 'none' }}
        />
        {!sold && (
          <select
            value={fStatus}
            onChange={e => setFStatus(e.target.value)}
            style={{ background: T.card, border: `1px solid ${T.border}`, color: T.text, padding: '10px 13px', borderRadius: 10, fontSize: 13, outline: 'none' }}
          >
            <option value=''>Barcha status</option>
            <option value='Sotuvda'>Sotuvda</option>
            <option value='Sotilgan'>Sotilgan</option>
          </select>
        )}
        <select
          value={fUser}
          onChange={e => setFUser(e.target.value)}
          style={{ background: T.card, border: `1px solid ${T.border}`, color: T.text, padding: '10px 13px', borderRadius: 10, fontSize: 13, outline: 'none' }}
        >
          <option value=''>Barcha referal</option>
          {xodimlar.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>

      <TableWrap
        headers={['Mashina', 'Status', 'Kirish narxi', 'Sotuv narxi', sold ? 'Foyda' : 'Probeg', 'Amallar']}
        rows={visible.map((c, i) => {
          const profit = (c.totalAmount || 0) - (c.buyPrice || 0)
          return (
            <tr
              key={c.id}
              className="hover-row"
              style={{ background: i % 2 ? '#ffffff03' : 'transparent', cursor: sold ? 'pointer' : 'default' }}
              onClick={() => sold && handleShowSold(c)}
            >
              <td>{c.brand} {c.model}</td>
              <td><Badge text={c.status} color={c.status === 'Sotuvda' ? 'blue' : 'green'} /></td>
              <td>{fmtSum(c.buyPrice)}</td>
              <td>{fmtSum(c.totalAmount || c.sellPrice)}</td>
              <td>{sold ? <span style={{ color: profit >= 0 ? 'green' : 'red' }}>{fmtSum(profit)}</span> : `${(c.mileage || 0).toLocaleString()} km`}</td>
              <td style={{ display: 'flex', gap: 5 }}>
                <Btn size='sm' variant='ghost' onClick={(e) => { e.stopPropagation(); setEditCar(c); setModal(true) }}>✏️</Btn>
                <Btn size='sm' variant='danger' onClick={(e) => { e.stopPropagation(); setConfirm(c.id) }}>🗑</Btn>
                {!sold && c.status === 'Sotuvda' && <Btn size='sm' variant='success' onClick={(e) => { e.stopPropagation(); setSaleModalCar(c) }}>Sotildi</Btn>}
              </td>
            </tr>
          )
        })}
      />

      {confirm && <Confirm message="Bu mashinani o'chirmoqchimisiz?" onYes={() => delCar(confirm)} onNo={() => setConfirm(null)} />}
      {modal && <Modal title={editCar ? 'Tahrirlash' : 'Yangi Mashina'} onClose={() => { setModal(false); setEditCar(null) }} width={640}>
        <CarForm initial={editCar} onSave={saveCar} onClose={() => { setModal(false); setEditCar(null) }} />
      </Modal>}
      {saleModalCar && <SaleModal car={saleModalCar} onClose={() => setSaleModalCar(null)} onSave={(data) => {
        setCars(p => p.map(c => c.id === saleModalCar.id ? { 
          ...c, 
          status: 'Sotilgan',
          soldDate: new Date().toISOString().split('T')[0],
          soldById: currentUser.id,
          saleType: data.saleType,
          totalAmount: Number(data.totalAmount),
          advance: Number(data.advance),
          buyer: data.buyer
        } : c))
        addAudit(currentUser, 'Mashina sotildi', `${saleModalCar.brand} ${saleModalCar.model}`)
        setSaleModalCar(null)
      }} />}
      {soldModalCar && <SoldCarModal car={soldModalCar} onClose={() => setSoldModalCar(null)} />}
    </div>
  )
}