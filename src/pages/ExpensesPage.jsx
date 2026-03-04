import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { T } from '../utils/theme'
import { fmtSum, fmtDate, uid } from '../utils/helpers'
import { Btn, Inp, Modal, Confirm, Badge, PageHeader, TableWrap } from '../components/UI'

const TYPES = ['Ofis xarajati', 'Reklama', 'Transport', 'Remont', 'Boshqa']

export default function ExpensesPage() {
  const { expenses, setExpenses, currentUser, addAudit } = useApp()
  const [modal, setModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch] = useState('')
  const [fType, setFType] = useState('')

  const empty = { name: '', type: 'Ofis xarajati', amount: '', date: new Date().toISOString().split('T')[0], note: '' }
  const [f, setF] = useState(empty)

  const open = (e = null) => { setEdit(e); setF(e || empty); setModal(true) }

  const save = () => {
    if (!f.name.trim() || !f.amount) return
    const d = { ...f, amount: Number(f.amount) }
    if (edit) {
      setExpenses(p => p.map(e => e.id === edit.id ? { ...e, ...d } : e))
      addAudit(currentUser, 'Xarajat tahrirlandi', f.name)
    } else {
      setExpenses(p => [...p, { ...d, id: uid(), deleted: false }])
      addAudit(currentUser, "Xarajat qo'shildi", f.name)
    }
    setModal(false)
  }

  const del = (id) => { setExpenses(p => p.map(e => e.id === id ? { ...e, deleted: true } : e)); setConfirm(null) }

  const visible = expenses.filter(e => {
    if (e.deleted) return false
    if (fType && e.type !== fType) return false
    return !search || e.name.toLowerCase().includes(search.toLowerCase())
  })

  const total = visible.reduce((a, e) => a + e.amount, 0)
  const byType = {}
  visible.forEach(e => { byType[e.type] = (byType[e.type] || 0) + e.amount })

  return (
    <div className="fade-in">
      <PageHeader title="📉 Xarajatlar" sub={`Jami: ${fmtSum(total)}`} right={<Btn onClick={() => open()}>+ Xarajat Qo'shish</Btn>} />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={() => setFType('')} style={{ background: !fType ? T.accent + '25' : T.card, border: `1px solid ${!fType ? T.accent : T.border}`, color: !fType ? T.accent : T.soft, padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Barchasi</button>
        {TYPES.map(t => (
          <button key={t} onClick={() => setFType(fType === t ? '' : t)} style={{ background: fType === t ? T.accent + '25' : T.card, border: `1px solid ${fType === t ? T.accent : T.border}`, color: fType === t ? T.accent : T.soft, padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        {Object.entries(byType).map(([k, v]) => (
          <div key={k} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '10px 16px' }}>
            <div style={{ color: T.muted, fontSize: 11, fontWeight: 600 }}>{k}</div>
            <div style={{ color: T.red, fontWeight: 800, fontSize: 15, marginTop: 3 }}>{fmtSum(v)}</div>
          </div>
        ))}
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Qidirish..." style={{ width: '100%', background: T.card, border: `1px solid ${T.border}`, color: T.text, padding: '10px 14px', borderRadius: 10, fontSize: 13, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }} />

      <TableWrap
        headers={['Nomi', 'Turi', 'Summa', 'Sana', 'Izoh', 'Amallar']}
        rows={visible.map((e, i) => (
          <tr key={e.id} className="hover-row" style={{ borderTop: `1px solid ${T.border}`, background: i % 2 ? '#ffffff03' : 'transparent' }}>
            <td style={{ padding: '12px 14px', color: T.text, fontWeight: 600 }}>{e.name}</td>
            <td style={{ padding: '12px 14px' }}><Badge text={e.type} color='purple' /></td>
            <td style={{ padding: '12px 14px', color: T.red, fontWeight: 700, fontSize: 13 }}>{fmtSum(e.amount)}</td>
            <td style={{ padding: '12px 14px', color: T.muted, fontSize: 12 }}>{fmtDate(e.date)}</td>
            <td style={{ padding: '12px 14px', color: T.muted, fontSize: 12 }}>{e.note || '—'}</td>
            <td style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                <Btn size='sm' variant='ghost' onClick={() => open(e)}>✏️</Btn>
                <Btn size='sm' variant='danger' onClick={() => setConfirm(e.id)}>🗑</Btn>
              </div>
            </td>
          </tr>
        ))}
      />

      {modal && (
        <Modal title={edit ? 'Xarajatni Tahrirlash' : "Xarajat Qo'shish"} onClose={() => setModal(false)}>
          <Inp label="Nomi" value={f.name} onChange={v => setF(p => ({ ...p, name: v }))} required />
          <Inp label="Turi" value={f.type} onChange={v => setF(p => ({ ...p, type: v }))} options={TYPES} />
          <Inp label="Summa (so'm)" value={f.amount} onChange={v => setF(p => ({ ...p, amount: v }))} type="number" required placeholder="masalan: 5000000" />
          <Inp label="Sana" value={f.date} onChange={v => setF(p => ({ ...p, date: v }))} type="date" />
          <Inp label="Izoh" value={f.note} onChange={v => setF(p => ({ ...p, note: v }))} textarea />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant='ghost' onClick={() => setModal(false)}>Bekor</Btn>
            <Btn onClick={save}>💾 Saqlash</Btn>
          </div>
        </Modal>
      )}
      {confirm && <Confirm message="Bu xarajatni o'chirmoqchimisiz?" onYes={() => del(confirm)} onNo={() => setConfirm(null)} />}
    </div>
  )
}
