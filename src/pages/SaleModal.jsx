import { useState } from 'react'
import { Btn, Inp, Modal } from '../components/UI'

export default function SaleModal({ car, onClose, onSave }) {
  const [saleType, setSaleType] = useState('Naxd')
  const [totalAmount, setTotalAmount] = useState('')  // kelishilgan summa
  const [advance, setAdvance] = useState('')          // oldindan to'lov
  const [buyer, setBuyer] = useState({               // haridor ma'lumotlari
    name: '', surname: '', phone: '', passport: '', address: '', note: ''
  })

  const handleSave = () => {
    if (!buyer.name.trim() || !buyer.surname.trim() || !buyer.phone.trim()) {
      alert("Ism, familiya va telefon raqami majburiy!")
      return
    }
    onSave({
      status: 'Sotilgan',
      soldDate: new Date().toISOString().split('T')[0],
      soldById: car.soldById,
      saleType,
      totalAmount: Number(totalAmount) || 0,
      advance: Number(advance) || 0,
      buyer
    })
    onClose()
  }

  return (
    <Modal title={`Sotish: ${car.brand} ${car.model}`} onClose={onClose} width={500}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label>Sotuv turi</label>
        <select value={saleType} onChange={e => setSaleType(e.target.value)} style={{ padding: 8 }}>
          <option value="Naxd">Naxd savdo</option>
          <option value="Kredit">Kredit</option>
          <option value="Bolib tolash">Bo‘lib to‘lash</option>
          <option value="Qarz">Qarzga sotildi</option>
        </select>

        <Inp label="Kelishilgan summa (so‘m)" value={totalAmount} onChange={v => setTotalAmount(v)} type="number" />
        <Inp label="Oldindan to‘lov (so‘m)" value={advance} onChange={v => setAdvance(v)} type="number" />

        <Inp label="Ism" value={buyer.name} onChange={v => setBuyer(p => ({ ...p, name: v }))} />
        <Inp label="Familiya" value={buyer.surname} onChange={v => setBuyer(p => ({ ...p, surname: v }))} />
        <Inp label="Telefon" value={buyer.phone} onChange={v => setBuyer(p => ({ ...p, phone: v }))} />
        <Inp label="Pasport" value={buyer.passport} onChange={v => setBuyer(p => ({ ...p, passport: v }))} />
        <Inp label="Manzil" value={buyer.address} onChange={v => setBuyer(p => ({ ...p, address: v }))} />
        <Inp label="Izoh" value={buyer.note} onChange={v => setBuyer(p => ({ ...p, note: v }))} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <Btn variant="ghost" onClick={onClose}>Bekor</Btn>
          <Btn onClick={handleSave}>Sotildi</Btn>
        </div>
      </div>
    </Modal>
  )
}