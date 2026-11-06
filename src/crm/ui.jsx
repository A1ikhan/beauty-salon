import { useState } from 'react'
import { STATUSES, SLOT_TIMES } from '../data/mock'
import { money, todayKey, useStore } from '../store/Store'

export function StatusBadge({ status }) {
  const s = STATUSES[status]
  return (
    <span className="badge" style={{ color: s.color, background: s.color + '1a' }}>
      {s.label}
    </span>
  )
}

export function Avatar({ name, color = '#c97b84', size = 32 }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('')
  return (
    <span className="avatar" style={{ background: color, width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </span>
  )
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Kpi({ label, value, hint, trend }) {
  return (
    <div className="kpi">
      <span>{label}</span>
      <b>{value}</b>
      {hint && <small className={trend > 0 ? 'up' : trend < 0 ? 'down' : ''}>{hint}</small>}
    </div>
  )
}

// Форма создания / редактирования записи
export function AppointmentForm({ initial, defaults, onClose }) {
  const store = useStore()
  const { clients, masters, services } = store
  const [f, setF] = useState(
    initial || { clientId: clients[0]?.id, masterId: masters[0].id, serviceId: '', date: todayKey(), time: '10:00', status: 'new', comment: '', ...defaults },
  )
  const master = masters.find((m) => m.id === f.masterId)
  const svcOptions = services.filter((s) => master.categories.includes(s.category))
  const serviceId = svcOptions.some((s) => s.id === f.serviceId) ? f.serviceId : svcOptions[0].id
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))

  const busy = store.appointments.some(
    (a) => a.id !== initial?.id && a.date === f.date && a.time === f.time && a.masterId === f.masterId && a.status !== 'cancelled',
  )

  const save = (e) => {
    e.preventDefault()
    const price = services.find((s) => s.id === serviceId).price
    const data = { ...f, serviceId, price: initial && initial.serviceId === serviceId ? f.price : price }
    if (initial) store.updateAppointment(initial.id, data)
    else store.addAppointment(data)
    onClose()
  }

  return (
    <form className="form" onSubmit={save}>
      <label className="wide">Клиент
        <select value={f.clientId} onChange={set('clientId')}>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>)}
        </select>
      </label>
      <label>Мастер
        <select value={f.masterId} onChange={set('masterId')}>
          {masters.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </label>
      <label>Услуга
        <select value={serviceId} onChange={set('serviceId')}>
          {svcOptions.map((s) => <option key={s.id} value={s.id}>{s.name} — {money(s.price)}</option>)}
        </select>
      </label>
      <label>Дата<input type="date" value={f.date} onChange={set('date')} required /></label>
      <label>Время
        <select value={f.time} onChange={set('time')}>
          {SLOT_TIMES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label className="wide">Статус
        <select value={f.status} onChange={set('status')}>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </label>
      <label className="wide">Комментарий<textarea rows="2" value={f.comment} onChange={set('comment')} /></label>
      {busy && <p className="warn wide">⚠ У мастера уже есть запись на это время</p>}
      <div className="form-actions wide">
        {initial && (
          <button type="button" className="btn ghost danger" onClick={() => { store.deleteAppointment(initial.id); onClose() }}>
            Удалить
          </button>
        )}
        <span style={{ flex: 1 }} />
        <button type="button" className="btn ghost" onClick={onClose}>Отмена</button>
        <button className="btn" type="submit">{initial ? 'Сохранить' : 'Создать запись'}</button>
      </div>
    </form>
  )
}
