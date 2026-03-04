import { T } from '../utils/theme'

export function Badge({ text, color = 'gray' }) {
  const m = {
    green:  { bg: '#10b98118', c: '#10b981', b: '#10b98130' },
    blue:   { bg: '#3b82f618', c: '#3b82f6', b: '#3b82f630' },
    red:    { bg: '#ef444418', c: '#ef4444', b: '#ef444430' },
    yellow: { bg: '#f59e0b18', c: '#f59e0b', b: '#f59e0b30' },
    purple: { bg: '#8b5cf618', c: '#8b5cf6', b: '#8b5cf630' },
    cyan:   { bg: '#06b6d418', c: '#06b6d4', b: '#06b6d430' },
    orange: { bg: '#f9731618', c: '#f97316', b: '#f9731630' },
    gray:   { bg: '#64748b18', c: '#94a3b8', b: '#64748b30' },
  }
  const s = m[color] || m.gray
  return (
    <span style={{ background: s.bg, color: s.c, border: `1px solid ${s.b}`, padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {text}
    </span>
  )
}

export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, style: sx = {} }) {
  const pad = size === 'sm' ? '6px 13px' : size === 'lg' ? '13px 28px' : '9px 18px'
  const fs = size === 'sm' ? 12 : 14
  const vs = {
    primary: { background: T.accent, color: '#fff' },
    ghost:   { background: 'transparent', color: T.soft, border: `1px solid ${T.border}` },
    danger:  { background: T.red, color: '#fff' },
    success: { background: T.green, color: '#fff' },
    gold:    { background: T.gold, color: '#000' },
    orange:  { background: T.orange, color: '#fff' },
  }
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      border: 'none', borderRadius: 10, fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1,
      transition: 'all .15s', fontFamily: 'inherit', padding: pad, fontSize: fs,
      width: full ? '100%' : 'auto', ...vs[variant] || vs.primary, ...sx
    }}>
      {children}
    </button>
  )
}

export function Inp({ label, value, onChange, type = 'text', placeholder, required, error, options, textarea, disabled, style: sx = {} }) {
  const base = {
    width: '100%', background: disabled ? T.surface : T.card,
    border: `1px solid ${error ? T.red : T.border}`, color: T.text,
    padding: '10px 13px', borderRadius: 10, fontSize: 14, outline: 'none',
    boxSizing: 'border-box', opacity: disabled ? .6 : 1
  }
  return (
    <div style={{ marginBottom: 14, ...sx }}>
      {label && (
        <label style={{ display: 'block', color: T.soft, fontSize: 12, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: .5 }}>
          {label}{required && <span style={{ color: T.red }}> *</span>}
        </label>
      )}
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled} style={base}>
          <option value=''>— Tanlang —</option>
          {options.map(o => typeof o === 'object'
            ? <option key={o.v} value={o.v}>{o.l}</option>
            : <option key={o} value={o}>{o}</option>
          )}
        </select>
      ) : textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} disabled={disabled} style={{ ...base, resize: 'vertical' }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={base} />
      )}
      {error && <div style={{ color: T.red, fontSize: 11, marginTop: 3 }}>{error}</div>}
    </div>
  )
}

export function Modal({ title, onClose, children, width = 500 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000d', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div className="fade-in" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, width: '100%', maxWidth: width, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ color: T.text, fontSize: 18, fontWeight: 800 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Confirm({ message, onYes, onNo }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000e', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="fade-in" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32, maxWidth: 360, width: '90%', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
        <p style={{ color: T.text, fontWeight: 600, marginBottom: 24, lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Btn variant='ghost' onClick={onNo}>Bekor</Btn>
          <Btn variant='danger' onClick={onYes}>Ha, tasdiqlash</Btn>
        </div>
      </div>
    </div>
  )
}

export function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: '18px 20px', flex: 1, minWidth: 150, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: 14, top: 14, fontSize: 30, opacity: .08 }}>{icon}</div>
      <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 6 }}>{label}</div>
      <div style={{ color: color || T.accent, fontSize: 22, fontWeight: 900, letterSpacing: -.5, lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export function PageHeader({ title, sub, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ color: T.text, fontSize: 22, fontWeight: 900, marginBottom: 3 }}>{title}</h1>
        {sub && <p style={{ color: T.muted, fontSize: 13 }}>{sub}</p>}
      </div>
      {right && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{right}</div>}
    </div>
  )
}

export function TableWrap({ headers, rows, empty = "Ma'lumot topilmadi" }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr style={{ background: T.surface }}>
              {headers.map(h => (
                <th key={h} style={{ padding: '12px 14px', color: T.muted, fontSize: 11, fontWeight: 700, textAlign: 'left', textTransform: 'uppercase', letterSpacing: .5, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0
              ? <tr><td colSpan={headers.length} style={{ padding: 40, textAlign: 'center', color: T.muted, fontSize: 14 }}>📭 {empty}</td></tr>
              : rows
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
