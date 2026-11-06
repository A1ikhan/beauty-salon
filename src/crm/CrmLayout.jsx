import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { SALON } from '../data/mock'
import { useStore } from '../store/Store'
import './crm.css'

const NAV = [
  { to: '/crm', label: 'Дашборд', icon: '◧', end: true },
  { to: '/crm/appointments', label: 'Записи', icon: '◷' },
  { to: '/crm/clients', label: 'Клиенты', icon: '◉' },
  { to: '/crm/masters', label: 'Мастера', icon: '✦' },
  { to: '/crm/services', label: 'Услуги', icon: '❖' },
]

export default function CrmLayout() {
  const { appointments, reset } = useStore()
  const [open, setOpen] = useState(false)
  const newCount = appointments.filter((a) => a.status === 'new').length

  return (
    <div className={`crm ${open ? 'nav-open' : ''}`}>
      <aside className="sidebar">
        <div className="sb-logo">
          {SALON.name}
          <span>CRM</span>
        </div>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}>
              <i>{n.icon}</i> {n.label}
              {n.label === 'Записи' && newCount > 0 && <em>{newCount}</em>}
            </NavLink>
          ))}
        </nav>
        <div className="sb-bottom">
          <Link to="/">← На сайт</Link>
          <button
            onClick={() => {
              if (confirm('Сбросить все изменения и вернуть мокап-данные?')) reset()
            }}
          >
            Сбросить демо-данные
          </button>
          <div className="sb-user">
            <span className="avatar" style={{ background: '#6d6875', width: 34, height: 34, fontSize: 13 }}>АД</span>
            <div>
              <b>Администратор</b>
              <small>admin@lumiere</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="sb-overlay" onClick={() => setOpen(false)} />
      <main className="crm-main">
        <button className="burger" onClick={() => setOpen(true)} aria-label="Меню">☰</button>
        <Outlet />
      </main>
    </div>
  )
}
