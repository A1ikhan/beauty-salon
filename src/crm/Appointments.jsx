import { useState } from 'react'
import { dayKey, SLOT_TIMES, STATUSES } from '../data/mock'
import { fmtDate, money, todayKey, useStore } from '../store/Store'
import { AppointmentForm, Avatar, Modal, StatusBadge } from './ui'

const move = (date, n) => {
  const d = new Date(date + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return dayKey(d)
}

export default function Appointments() {
  const { appointments, clients, masters, services, updateAppointment } = useStore()
  const [view, setView] = useState('calendar')
  const [date, setDate] = useState(todayKey())
  const [edit, setEdit] = useState(null)
  const [status, setStatus] = useState('all')
  const [master, setMaster] = useState('all')
  const [q, setQ] = useState('')

  const C = (id) => clients.find((c) => c.id === id)
  const S = (id) => services.find((s) => s.id === id)

  const dayList = appointments.filter((a) => a.date === date)
  const dayRevenue = dayList.filter((a) => a.status !== 'cancelled' && a.status !== 'no-show').reduce((s, a) => s + a.price, 0)

  const list = appointments
    .filter((a) => (status === 'all' || a.status === status) && (master === 'all' || a.masterId === master))
    .filter((a) => !q || C(a.clientId)?.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
    .slice(0, 150)

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Записи</h1>
          <p className="muted">Всего {appointments.length} · новых {appointments.filter((a) => a.status === 'new').length}</p>
        </div>
        <div className="row">
          <div className="seg">
            <button className={view === 'calendar' ? 'on' : ''} onClick={() => setView('calendar')}>Календарь</button>
            <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>Список</button>
          </div>
          <button className="btn" onClick={() => setEdit({ date, time: '10:00', masterId: masters[0].id, clientId: clients[0].id, status: 'new', comment: '', _new: true })}>
            + Запись
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <section className="card">
          <div className="cal-toolbar">
            <div className="row">
              <button className="icon-btn" onClick={() => setDate(move(date, -1))}>‹</button>
              <button className="btn ghost sm" onClick={() => setDate(todayKey())}>Сегодня</button>
              <button className="icon-btn" onClick={() => setDate(move(date, 1))}>›</button>
              <h2>{fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
            </div>
            <div className="row muted">
              <span>{dayList.length} записей</span>·<span>{money(dayRevenue)}</span>
              <input type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
            </div>
          </div>
          <div className="cal-scroll">
            <div className="cal" style={{ gridTemplateColumns: `64px repeat(${masters.length}, minmax(150px, 1fr))` }}>
              <div className="cal-corner" />
              {masters.map((m) => (
                <div key={m.id} className="cal-head">
                  <Avatar name={m.name} color={m.color} size={26} />
                  <span>{m.name.split(' ')[0]}</span>
                </div>
              ))}
              {SLOT_TIMES.map((t) => (
                <Row key={t} t={t} masters={masters} dayList={dayList} C={C} S={S} date={date} clients={clients} setEdit={setEdit} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="card">
          <div className="filters">
            <input placeholder="Поиск по клиенту…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Все статусы</option>
              {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={master} onChange={(e) => setMaster(e.target.value)}>
              <option value="all">Все мастера</option>
              {masters.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Дата</th><th>Клиент</th><th>Услуга</th><th>Мастер</th><th>Сумма</th><th>Статус</th><th /></tr>
              </thead>
              <tbody>
                {list.map((a) => {
                  const m = masters.find((x) => x.id === a.masterId)
                  return (
                    <tr key={a.id} onClick={() => setEdit(a)}>
                      <td className="nowrap">{fmtDate(a.date, { day: '2-digit', month: '2-digit', year: '2-digit' })} <span className="muted">{a.time}</span></td>
                      <td>{C(a.clientId)?.name}</td>
                      <td>{S(a.serviceId)?.name}</td>
                      <td><span className="chip" style={{ borderColor: m.color }}>{m.name}</span></td>
                      <td className="nowrap">{money(a.price)}</td>
                      <td><StatusBadge status={a.status} /></td>
                      <td onClick={(e) => e.stopPropagation()}>
                        {a.status === 'new' && <button className="btn sm ghost" onClick={() => updateAppointment(a.id, { status: 'confirmed' })}>Подтвердить</button>}
                        {a.status === 'confirmed' && <button className="btn sm ghost" onClick={() => updateAppointment(a.id, { status: 'done' })}>Завершить</button>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {list.length === 150 && <p className="muted small">Показаны последние 150 записей — уточните фильтр.</p>}
        </section>
      )}

      {edit && (
        <Modal title={edit._new ? 'Новая запись' : 'Запись'} onClose={() => setEdit(null)}>
          <AppointmentForm initial={edit._new ? null : edit} defaults={edit._new ? { date: edit.date, time: edit.time, masterId: edit.masterId } : undefined} key={edit.id || 'new'} onClose={() => setEdit(null)} />
        </Modal>
      )}
    </>
  )
}

function Row({ t, masters, dayList, C, S, setEdit, date, clients }) {
  return (
    <>
      <div className="cal-time">{t}</div>
      {masters.map((m) => {
        const a = dayList.find((x) => x.masterId === m.id && x.time === t && x.status !== 'cancelled')
        if (!a)
          return (
            <div
              key={m.id}
              className="cal-cell empty"
              onClick={() => setEdit({ _new: true, date, time: t, masterId: m.id, clientId: clients[0].id })}
              title="Создать запись"
            />
          )
        return (
          <div key={m.id} className={`cal-cell appt st-${a.status}`} style={{ '--c': m.color }} onClick={() => setEdit(a)}>
            <b>{C(a.clientId)?.name}</b>
            <small>{S(a.serviceId)?.name}</small>
          </div>
        )
      })}
    </>
  )
}
