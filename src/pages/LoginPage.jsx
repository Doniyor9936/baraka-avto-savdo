import { useState } from 'react'
import { T } from '../utils/theme'
import { Btn, Inp } from '../components/UI'
import logo from '/logo.jpg'

export default function LoginPage({ onLogin, users }) {
  const [login, setLogin] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  const handle = () => {
    const u = users.find(x => x.login === login.trim() && x.password === pass && x.active)
    if (u) onLogin(u)
    else setErr("Login yoki parol noto'g'ri!")
  }

  const handleKey = (e) => { if (e.key === 'Enter') handle() }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 24, padding: 40, width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 110, height: 110, borderRadius: 22, overflow: 'hidden', margin: '0 auto 14px', background: '#fff', boxShadow: '0 4px 24px #0004' }}>
            <img src={logo} alt="Baraka Avto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: T.gold, letterSpacing: -.5 }}>BARAKA</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: T.accent, letterSpacing: -.5 }}> AVTO</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: T.text, letterSpacing: -.5 }}> SAVDO</span>
          </div>
          <p style={{ color: T.muted, fontSize: 13 }}>Tizimga kirish uchun ma'lumotlarni kiriting</p>
        </div>

        <Inp label="Login" value={login} onChange={setLogin} placeholder="login" />
        <div onKeyDown={handleKey}>
          <Inp label="Parol" value={pass} onChange={setPass} type="password" placeholder="••••••••" />
        </div>

        {err && (
          <div style={{ color: T.red, fontSize: 13, marginBottom: 14, textAlign: 'center', background: T.red + '15', borderRadius: 8, padding: '8px 12px' }}>
            {err}
          </div>
        )}

        <Btn onClick={handle} size='lg' full>Kirish →</Btn>
      </div>
    </div>
  )
}
