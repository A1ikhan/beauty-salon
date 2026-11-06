import { CATEGORIES, dayKey } from '../data/mock'
import { money, todayKey, useStore } from '../store/Store'
import { Avatar } from './ui'

export default function Masters() {
  const { masters, appointments } = useStore()
  const today = todayKey()
  const from = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 29)
    return dayKey(d)
  })()

  const rows = masters.map((m) => {
    const mine = appointments.filter((a) => a.masterId === m.id)
    const done = mine.filter((a) => a.status === 'done' && a.date >= from)
    const revenue = done.reduce((s, a) => s + a.price, 0)
    return {
      ...m,
      visits: done.length,
      revenue,
      upcoming: mine.filter((a) => a.date >= today && (a.status === 'new' || a.status === 'confirmed')).length,
      clients: new Set(done.map((a) => a.clientId)).size,
    }
  })
  const best = Math.max(...rows.map((r) => r.revenue), 1)

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Мастера</h1>
          <p className="muted">Показатели за последние 30 дней</p>
        </div>
      </div>
      <div className="masters-cards">
        {rows.map((m) => (
          <section className="card master-card" key={m.id}>
            <div className="mc-head">
              <Avatar name={m.name} color={m.color} size={52} />
              <div>
                <h3>{m.name}</h3>
                <p className="muted">{m.role}</p>
              </div>
              <span className="rating">★ {m.rating}</span>
            </div>
            <div className="mc-tags">
              {m.categories.map((c) => {
                const cat = CATEGORIES.find((x) => x.id === c)
                return <span className="tag" key={c}>{cat.icon} {cat.name}</span>
              })}
              <span className="tag">График: {m.schedule}</span>
              <span className="tag">Стаж {m.experience} лет</span>
            </div>
            <div className="mini-kpis">
              <div><small>Выручка</small><b>{money(m.revenue)}</b></div>
              <div><small>Визитов</small><b>{m.visits}</b></div>
              <div><small>Клиентов</small><b>{m.clients}</b></div>
              <div><small>Впереди</small><b>{m.upcoming}</b></div>
            </div>
            <div className="progress"><i style={{ width: `${(m.revenue / best) * 100}%`, background: m.color }} /></div>
          </section>
        ))}
      </div>
    </>
  )
}
