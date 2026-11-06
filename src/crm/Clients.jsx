import { useState } from 'react'
import { fmtDate, money, useStore } from '../store/Store'
import { Avatar, Modal, StatusBadge } from './ui'

const SORTS = {
  spent: { label: 'По сумме', fn: (a, b) => b.spent - a.spent },
  visits: { label: 'По визитам', fn: (a, b) => b.visits - a.visits },
  last: { label: 'По последнему визиту', fn: (a, b) => (b.last || '').localeCompare(a.last || '') },
  name: { label: 'По имени', fn: (a, b) => a.name.localeCompare(b.name) },
}

export default function Clients() {
  const { clients, appointments, addClient } = useStore()
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('all')
  const [sort, setSort] = useState('spent')
  const [openId, setOpenId] = useState(null)
  const [creating, setCreating] = useState(false)

  const rows = clients.map((c) => {
    const done = appointments.filter((a) => a.clientId === c.id && a.status === 'done')
    return { ...c, visits: done.length, spent: done.reduce((s, a) => s + a.price, 0), last: done.map((a) => a.date).sort().pop() }
  })
  const tags = [...new Set(clients.flatMap((c) => c.tags))]
  const list = rows
    .filter((c) => tag === 'all' || c.tags.includes(tag))
    .filter((c) => !q || (c.name + c.phone).toLowerCase().includes(q.toLowerCase()))
    .sort(SORTS[sort].fn)

  const opened = rows.find((c) => c.id === openId)

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Клиенты</h1>
          <p className="muted">{clients.length} в базе</p>
        </div>
        <button className="btn" onClick={() => setCreating(true)}>+ Клиент</button>
      </div>

      <section className="card">
        <div className="filters">
          <input placeholder="Имя или телефон…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="all">Все теги</option>
            {tags.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Клиент</th><th>Телефон</th><th>Визиты</th><th>Потрачено</th><th>Последний визит</th><th>Источник</th><th>Теги</th></tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} onClick={() => setOpenId(c.id)}>
                  <td><div className="person"><Avatar name={c.name} size={30} /> {c.name}</div></td>
                  <td className="nowrap">{c.phone}</td>
                  <td>{c.visits}</td>
                  <td className="nowrap">{money(c.spent)}</td>
                  <td>{c.last ? fmtDate(c.last) : <span className="muted">—</span>}</td>
                  <td>{c.source}</td>
                  <td>{c.tags.map((t) => <span key={t} className={`tag ${t === 'VIP' ? 'vip' : ''}`}>{t}</span>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {opened && <ClientDrawer client={opened} onClose={() => setOpenId(null)} />}
      {creating && (
        <Modal title="Новый клиент" onClose={() => setCreating(false)}>
          <NewClient onSave={(c) => { const nc = addClient(c); setCreating(false); setOpenId(nc.id) }} onCancel={() => setCreating(false)} />
        </Modal>
      )}
    </>
  )
}

function ClientDrawer({ client, onClose }) {
  const { appointments, services, masters, updateClient } = useStore()
  const [note, setNote] = useState(client.note)
  const history = appointments.filter((a) => a.clientId === client.id).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
  const fav = Object.entries(
    history.filter((a) => a.status === 'done').reduce((acc, a) => ({ ...acc, [a.masterId]: (acc[a.masterId] || 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1])[0]
  const favMaster = fav && masters.find((m) => m.id === fav[0])

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="drawer" onMouseDown={(e) => e.stopPropagation()}>
        <button className="icon-btn close" onClick={onClose}>✕</button>
        <div className="drawer-head">
          <Avatar name={client.name} size={56} />
          <div>
            <h2>{client.name}</h2>
            <p className="muted">{client.phone}{client.email && ` · ${client.email}`}</p>
            <div>{client.tags.map((t) => <span key={t} className={`tag ${t === 'VIP' ? 'vip' : ''}`}>{t}</span>)}</div>
          </div>
        </div>
        <div className="mini-kpis">
          <div><small>Визитов</small><b>{client.visits}</b></div>
          <div><small>Потрачено</small><b>{money(client.spent)}</b></div>
          <div><small>Средний чек</small><b>{money(client.visits ? Math.round(client.spent / client.visits) : 0)}</b></div>
        </div>
        <dl className="props">
          <dt>День рождения</dt><dd>{client.birthday ? fmtDate(client.birthday, { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</dd>
          <dt>Источник</dt><dd>{client.source}</dd>
          <dt>Клиент с</dt><dd>{fmtDate(client.createdAt, { month: 'long', year: 'numeric' })}</dd>
          <dt>Любимый мастер</dt><dd>{favMaster ? favMaster.name : '—'}</dd>
        </dl>
        <label className="note">Заметка
          <textarea rows="3" value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => updateClient(client.id, { note })} placeholder="Предпочтения, аллергии…" />
        </label>
        <h3>История визитов</h3>
        <ul className="history">
          {history.length === 0 && <li className="muted">Пока нет визитов</li>}
          {history.map((a) => (
            <li key={a.id}>
              <div>
                <b>{services.find((s) => s.id === a.serviceId)?.name}</b>
                <small>{fmtDate(a.date, { day: 'numeric', month: 'short', year: 'numeric' })}, {a.time} · {masters.find((m) => m.id === a.masterId)?.name}</small>
              </div>
              <div className="right">
                <span>{money(a.price)}</span>
                <StatusBadge status={a.status} />
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

function NewClient({ onSave, onCancel }) {
  const [f, setF] = useState({ name: '', phone: '', email: '', birthday: '', source: 'Пришли сами' })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); onSave(f) }}>
      <label className="wide">Имя и фамилия<input required value={f.name} onChange={set('name')} /></label>
      <label>Телефон<input required value={f.phone} onChange={set('phone')} placeholder="+7" /></label>
      <label>Email<input type="email" value={f.email} onChange={set('email')} /></label>
      <label>День рождения<input type="date" value={f.birthday} onChange={set('birthday')} /></label>
      <label>Источник
        <select value={f.source} onChange={set('source')}>
          {['Instagram', 'Сайт', 'Рекомендация', '2ГИС', 'Пришли сами'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <div className="form-actions wide">
        <span style={{ flex: 1 }} />
        <button type="button" className="btn ghost" onClick={onCancel}>Отмена</button>
        <button className="btn">Сохранить</button>
      </div>
    </form>
  )
}
