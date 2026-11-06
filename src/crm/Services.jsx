import { useState } from 'react'
import { CATEGORIES } from '../data/mock'
import { money, useStore } from '../store/Store'

export default function Services() {
  const { services, appointments, masters } = useStore()
  const [cat, setCat] = useState('all')

  const rows = services
    .filter((s) => cat === 'all' || s.category === cat)
    .map((s) => {
      const done = appointments.filter((a) => a.serviceId === s.id && a.status === 'done')
      return { ...s, count: done.length, revenue: done.reduce((x, a) => x + a.price, 0) }
    })
    .sort((a, b) => b.revenue - a.revenue)
  const max = Math.max(...rows.map((r) => r.revenue), 1)

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Услуги</h1>
          <p className="muted">{services.length} услуг в прайсе · статистика за всё время</p>
        </div>
      </div>
      <section className="card">
        <div className="filters">
          <div className="seg">
            <button className={cat === 'all' ? 'on' : ''} onClick={() => setCat('all')}>Все</button>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={cat === c.id ? 'on' : ''} onClick={() => setCat(c.id)}>{c.icon} {c.name}</button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Услуга</th><th>Направление</th><th>Длительность</th><th>Цена</th><th>Мастера</th><th>Продаж</th><th style={{ width: '22%' }}>Выручка</th></tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const c = CATEGORIES.find((x) => x.id === s.category)
                return (
                  <tr key={s.id} className="no-click">
                    <td><b>{s.name}</b></td>
                    <td>{c.icon} {c.name}</td>
                    <td>{s.duration} мин</td>
                    <td className="nowrap">{money(s.price)}</td>
                    <td>{masters.filter((m) => m.categories.includes(s.category)).length}</td>
                    <td>{s.count}</td>
                    <td>
                      <div className="cell-bar"><i style={{ width: `${(s.revenue / max) * 100}%` }} /><span>{money(s.revenue)}</span></div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
