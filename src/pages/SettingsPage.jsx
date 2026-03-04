import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { T } from '../utils/theme'
import { uid, fmtDate } from '../utils/helpers'
import { Btn, Inp, Modal, Confirm, Badge, PageHeader, TableWrap } from '../components/UI'

export default function SettingsPage() {
  const { users, setUsers, currentUser, addAudit } = useApp()
  const isAdmin = currentUser.role === 'admin'

  const [pwForm, setPwForm] = useState({ old: '', new1: '', new2: '' })
  const [pwMsg, setPwMsg] = useState('')

  const [userModal, setUserModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const empty = { name: '', login: '', password: '', role: 'xodim', active: true }
  const [uf, setUf] = useState(empty)
  const [ufErr, setUfErr] = useState({})

  const changePw = () => {
    if (pwForm.old !== currentUser.password) { setPwMsg("❌ Eski parol noto'g'ri"); return }
    if (pwForm.new1.length < 4) { setPwMsg('❌ Yangi parol kamida 4 ta belgi'); return }
    if (pwForm.new1 !== pwForm.new2) { setPwMsg('❌ Yangi parollar mos emas'); return }
    setUsers(p => p.map(u => u.id === currentUser.id ? { ...u, password: pwForm.new1 } : u))
    setPwMsg("✅ Parol muvaffaqiyatli o'zgartirildi")
    setPwForm({ old: '', new1: '', new2: '' })
    addAudit(currentUser, "Parol o'zgartirildi", currentUser.name)
  }

  const openUser = (u = null) => { setEditUser(u); setUf(u || empty); setUfErr({}); setUserModal(true) }

  const saveUser = () => {
    const e = {}
    if (!uf.name.trim()) e.name = 'Ism majburiy'
    if (!uf.login.trim()) e.login = 'Login majburiy'
    if (!editUser && !uf.password.trim()) e.password = 'Parol majburiy'
    if (users.find(u => u.login === uf.login.trim() && u.id !== editUser?.id)) e.login = 'Bu login band'
    setUfErr(e)
    if (Object.keys(e).length) return
    if (editUser) {
      setUsers(p => p.map(u => u.id === editUser.id ? { ...u, ...uf, password: uf.password || u.password } : u))
      addAudit(currentUser, 'Foydalanuvchi tahrirlandi', uf.name)
    } else {
      setUsers(p => [...p, { ...uf, id: uid(), joined: new Date().toISOString().split('T')[0] }])
      addAudit(currentUser, "Foydalanuvchi qo'shildi", uf.name)
    }
    setUserModal(false)
  }

  const toggleActive = (id) => {
    const u = users.find(x => x.id === id)
    if (u.id === currentUser.id) return
    setUsers(p => p.map(x => x.id === id ? { ...x, active: !x.active } : x))
    addAudit(currentUser, u.active ? "Foydalanuvchi bloklandi" : "Foydalanuvchi faollashtirildi", u.name)
  }

  const delUser = (id) => {
    const u = users.find(x => x.id === id)
    setUsers(p => p.filter(x => x.id !== id))
    addAudit(currentUser, "Foydalanuvchi o'chirildi", u?.name || '')
    setConfirm(null)
  }

  return (
    <div className="fade-in">
      <PageHeader title="⚙️ Sozlamalar" />

      {/* Password change */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 20, maxWidth: 460 }}>
        <div style={{ color: T.text, fontWeight: 700, marginBottom: 16, fontSize: 15 }}>🔑 Parolni O'zgartirish</div>
        <Inp label="Eski parol" value={pwForm.old} onChange={v => setPwForm(p => ({ ...p, old: v }))} type="password" />
        <Inp label="Yangi parol" value={pwForm.new1} onChange={v => setPwForm(p => ({ ...p, new1: v }))} type="password" />
        <Inp label="Yangi parolni tasdiqlash" value={pwForm.new2} onChange={v => setPwForm(p => ({ ...p, new2: v }))} type="password" />
        {pwMsg && <div style={{ color: pwMsg.startsWith('✅') ? T.green : T.red, fontSize: 13, marginBottom: 12 }}>{pwMsg}</div>}
        <Btn onClick={changePw}>Parolni Saqlash</Btn>
      </div>

      {/* User management - admin only */}
      {isAdmin && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ color: T.text, fontWeight: 700, fontSize: 15 }}>👥 Foydalanuvchilarni Boshqarish</div>
            <Btn onClick={() => openUser()} size='sm'>+ Yangi</Btn>
          </div>
          <TableWrap
            headers={['Ism', 'Login', 'Rol', 'Status', "Qo'shilgan", 'Amallar']}
            rows={users.map((u, i) => (
              <tr key={u.id} className="hover-row" style={{ borderTop: `1px solid ${T.border}`, background: i % 2 ? '#ffffff03' : 'transparent' }}>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ color: T.text, fontWeight: 700 }}>{u.name}</div>
                  {u.id === currentUser.id && <span style={{ color: T.cyan, fontSize: 11 }}>(Siz)</span>}
                </td>
                <td style={{ padding: '11px 14px', color: T.soft, fontFamily: 'monospace', fontSize: 13 }}>{u.login}</td>
                <td style={{ padding: '11px 14px' }}><Badge text={u.role === 'admin' ? 'Admin' : 'Xodim'} color={u.role === 'admin' ? 'yellow' : 'blue'} /></td>
                <td style={{ padding: '11px 14px' }}><Badge text={u.active ? 'Faol' : 'Bloklangan'} color={u.active ? 'green' : 'red'} /></td>
                <td style={{ padding: '11px 14px', color: T.muted, fontSize: 12 }}>{fmtDate(u.joined)}</td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <Btn size='sm' variant='ghost' onClick={() => openUser(u)}>✏️</Btn>
                    {u.id !== currentUser.id && <>
                      <Btn size='sm' variant={u.active ? 'danger' : 'success'} onClick={() => toggleActive(u.id)}>{u.active ? '🔒' : '🔓'}</Btn>
                      <Btn size='sm' variant='danger' onClick={() => setConfirm(u.id)}>🗑</Btn>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
          />
        </div>
      )}

      {userModal && (
        <Modal title={editUser ? 'Foydalanuvchini Tahrirlash' : "Yangi Foydalanuvchi"} onClose={() => setUserModal(false)}>
          <Inp label="Ism Familiya" value={uf.name} onChange={v => setUf(p => ({ ...p, name: v }))} required error={ufErr.name} />
          <Inp label="Login" value={uf.login} onChange={v => setUf(p => ({ ...p, login: v }))} required error={ufErr.login} placeholder="faqat lotin harflar" />
          <Inp label={editUser ? "Yangi parol (o'zgartirmasangiz bo'sh qoldiring)" : 'Parol'} value={uf.password} onChange={v => setUf(p => ({ ...p, password: v }))} type="password" required={!editUser} error={ufErr.password} />
          {isAdmin && <Inp label="Rol" value={uf.role} onChange={v => setUf(p => ({ ...p, role: v }))} options={['xodim', 'admin']} />}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant='ghost' onClick={() => setUserModal(false)}>Bekor</Btn>
            <Btn onClick={saveUser}>💾 Saqlash</Btn>
          </div>
        </Modal>
      )}
      {confirm && <Confirm message="Bu foydalanuvchini o'chirmoqchimisiz?" onYes={() => delUser(confirm)} onNo={() => setConfirm(null)} />}
    </div>
  )
}
