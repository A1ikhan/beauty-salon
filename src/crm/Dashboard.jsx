import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, dayKey } from '../data/mock'
import { fmtDate, money, todayKey, useStore } from '../store/Store'
import { AppointmentForm, Avatar, Kpi, Modal, StatusBadge } from './ui'

const shift = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return dayKey(d)
}

export default function Dashboard() {
  const { appointments, clients, masters, services } = useStore()
  const [edit, setEdit] = useState(null)
  const today = todayKey()

  const stats = useMemo(() => {
    const done = appointments.filter((a) => a.status === 'done')
    const inRange = (a, from, to) => a.date >= from && a.date <= to
    const rev30 = done.filter((a) => inRange(a, shift(-29), today)).reduce((s, a) => s + a.price, 0)
    const revPrev = done.filter((a) => inRange(a, shift(-59), shift(-30))).reduce((s, a) => s + a.price, 0)
    const cnt30 = done.filter((a) => inRange(a, shift(-29), today)).length
    const newClients = clients.filter((c) => c.createdAt >= shift(-29)).length
    const past = appointments.filter((a) => a.date < today && a.date >= shift(-29))
    const cancelRate = past.length ? past.filter((a) => a.status === 'cancelled' || a.status === 'no-show').length / past.length : 0

    const days = Array.from({ length: 14 }, (_, i) => {
      const d = shift(i - 13)
      return { d, v: done.filter((a) => a.date === d).reduce((s, a) => s + a.price, 0) }
    })

    const byCat = CATEGORIES.map((c) => ({
      ...c,
      v: done
        .filter((a) => inRange(a, shift(-29), today) && services.find((s) => s.id === a.serviceId)?.category === c.id)
        .reduce((s, a) => s + a.price, 0),
    })).sort((a, b) => b.v - a.v)

    const load = masters.map((m) => ({
      ...m,
      n: appointments.filter((a) => a.masterId === m.id && a.date === today && a.status !== 'cancelled').length,
    }))

    return { rev30, revPrev, cnt30, avg: cnt30 ? Math.round(rev30 / cnt30) : 0, newClients, cancelRate, days, byCat, load }
  }, [appointments, clients, masters, services, today])

  const todayList = appointments.filter((a) => a.date === today).sort((a, b) => a.time.localeCompare(b.time))
  const growth = stats.revPrev ? Math.round(((stats.rev30 - stats.revPrev) / stats.revPrev) * 100) : 0
  const maxDay = Math.max(...stats.days.map((d) => d.v), 1)
  const maxCat = Math.max(...stats.byCat.map((d) => d.v), 1)
  const birthdays = clients.filter((c) => c.birthday && c.birthday.slice(5) >= today.slice(5) && c.birthday.slice(5) <= shift(7).slice(5))

  const C = (id) => clients.find((c) => c.id === id)
  const M = (id) => masters.find((m) => m.id === id)
  const S = (id) => services.find((s) => s.id === id)

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Добрый день 👋</h1>
          <p className="muted">{fmtDate(today, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <button className="btn" onClick={() => setEdit({})}>+ Новая запись</button>
      </div>

      <div className="kpis">
        <Kpi label="Выручка за 30 дней" value={money(stats.rev30)} hint={`${growth >= 0 ? '▲' : '▼'} ${Math.abs(growth)}% к прошлому периоду`} trend={growth} />
        <Kpi label="Визитов за 30 дней" value={stats.cnt30} hint={`Средний чек ${money(stats.avg)}`} />
        <Kpi label="Новых клиентов" value={stats.newClients} hint="за последние 30 дней" />
        <Kpi label="Отмены и неявки" value={`${Math.round(stats.cancelRate * 100)}%`} hint="за последние 30 дней" trend={-1} />
      </div>

      <div className="grid-2">
        <section className="card">
          <h2>Выручка по дням</h2>
          <div className="bars">
            {stats.days.map((d) => (
              <div key={d.d} className="bar-col" title={`${fmtDate(d.d)}: ${money(d.v)}`}>
                <div className="bar" style={{ height: `${(d.v / maxDay) * 100}%` }} />
                <small>{new Date(d.d + 'T00:00').getDate()}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Выручка по направлениям</h2>
          <ul className="hbars">
            {stats.byCat.map((c) => (
              <li key={c.id}>
                <span>{c.icon} {c.name}</span>
                <div><i style={{ width: `${(c.v / maxCat) * 100}%` }} /></div>
                <b>{money(c.v)}</b>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid-2 wide-left">
        <section className="card">
          <div className="card-head">
            <h2>Расписание на сегодня</h2>
            <Link to="/crm/appointments">Все записи →</Link>
          </div>
          {todayList.length === 0 && <p className="muted">Записей нет</p>}
          <ul className="timeline">
            {todayList.map((a) => (
              <li key={a.id} onClick={() => setEdit(a)}>
                <time>{a.time}</time>
                <span className="tl-line" style={{ background: M(a.masterId).color }} />
                <div>
                  <b>{C(a.clientId)?.name}</b>
                  <small>{S(a.serviceId)?.name} · {M(a.masterId).name}</small>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </section>

        <div className="stack">
          <section className="card">
            <h2>Загрузка мастеров сегодня</h2>
            <ul className="load">
              {stats.load.map((m) => (
                <li key={m.id}>
                  <Avatar name={m.name} color={m.color} size={28} />
                  <span>{m.name.split(' ')[0]}</span>
                  <div><i style={{ width: `${Math.min(m.n / 8, 1) * 100}%`, background: m.color }} /></div>
                  <b>{m.n}</b>
                </li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2>🎂 Дни рождения на неделе</h2>
            {birthdays.length === 0 && <p className="muted">Нет именинников</p>}
            <ul className="simple">
              {birthdays.map((c) => (
                <li key={c.id}><span>{c.name}</span><small>{fmtDate(c.birthday)}</small></li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {edit && (
        <Modal title={edit.id ? 'Запись' : 'Новая запись'} onClose={() => setEdit(null)}>
          <AppointmentForm initial={edit.id ? edit : null} onClose={() => setEdit(null)} />
        </Modal>
      )}
    </>
  )
}
