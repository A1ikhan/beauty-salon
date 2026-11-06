import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, MASTERS, REVIEWS, SALON, SERVICES, SLOT_TIMES } from '../data/mock'
import { money, todayKey, useStore } from '../store/Store'
import './landing.css'

export default function Landing() {
  const [cat, setCat] = useState('hair')
  const [preset, setPreset] = useState(null)

  const book = (serviceId) => {
    setPreset(serviceId)
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing">
      <header className="l-nav">
        <a href="#top" className="logo">
          {SALON.name}
          <span>{SALON.tagline}</span>
        </a>
        <nav>
          <a href="#services">Услуги</a>
          <a href="#masters">Мастера</a>
          <a href="#reviews">Отзывы</a>
          <a href="#contacts">Контакты</a>
        </nav>
        <div className="l-nav-actions">
          <Link to="/crm" className="btn ghost sm">CRM →</Link>
          <a href="#booking" className="btn sm">Записаться</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-text">
          <p className="eyebrow">{SALON.city} · с 2017 года</p>
          <h1>
            Красота, в которой <em>чувствуешь себя собой</em>
          </h1>
          <p className="lead">
            Стрижки и окрашивание, маникюр, уход за лицом и SPA — в одном месте. Подберём мастера и время за минуту.
          </p>
          <div className="hero-cta">
            <a href="#booking" className="btn">Записаться онлайн</a>
            <a href="#services" className="btn ghost">Смотреть прайс</a>
          </div>
          <ul className="hero-stats">
            <li><b>12 000+</b>довольных клиентов</li>
            <li><b>4.9 ★</b>рейтинг в 2ГИС</li>
            <li><b>7</b>мастеров</li>
          </ul>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="hero-card">
            <span className="dot" /> Сегодня свободно 6 окон
            <small>Ближайшее — 15:30, маникюр</small>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <h2>Услуги и цены</h2>
        <div className="tabs">
          {CATEGORIES.map((c) => (
            <button key={c.id} className={cat === c.id ? 'active' : ''} onClick={() => setCat(c.id)}>
              <span>{c.icon}</span> {c.name}
            </button>
          ))}
        </div>
        <ul className="price-list">
          {SERVICES.filter((s) => s.category === cat).map((s) => (
            <li key={s.id}>
              <div>
                <b>{s.name}</b>
                <small>{s.duration} мин</small>
              </div>
              <span className="dots" />
              <span className="price">от {money(s.price)}</span>
              <button className="btn ghost sm" onClick={() => book(s.id)}>Записаться</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="section alt" id="masters">
        <h2>Наши мастера</h2>
        <div className="masters-grid">
          {MASTERS.map((m) => (
            <article key={m.id} className="master">
              <div className="avatar" style={{ background: m.color }}>{m.photo}</div>
              <h3>{m.name}</h3>
              <p>{m.role}</p>
              <small>Стаж {m.experience} лет · ★ {m.rating}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section why">
        <h2>Почему выбирают нас</h2>
        <div className="why-grid">
          <div><b>Премиальная косметика</b><p>Работаем на Davines, Kérastase, CND и Christina.</p></div>
          <div><b>Стерильность</b><p>Сухожар и крафт-пакеты для каждого инструмента.</p></div>
          <div><b>Гарантия</b><p>Бесплатно исправим, если что-то не понравится, в течение 7 дней.</p></div>
          <div><b>Удобная запись</b><p>Онлайн 24/7, напоминание в WhatsApp за день до визита.</p></div>
        </div>
      </section>

      <section className="section alt" id="reviews">
        <h2>Отзывы</h2>
        <div className="reviews">
          {REVIEWS.map((r) => (
            <blockquote key={r.name}>
              <div className="stars">{'★'.repeat(r.rating)}</div>
              <p>{r.text}</p>
              <cite>{r.name}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      <BookingForm key={preset} preset={preset} />

      <footer className="l-footer" id="contacts">
        <div>
          <div className="logo">{SALON.name}<span>{SALON.tagline}</span></div>
          <p>{SALON.address}</p>
        </div>
        <div>
          <p><a href={`tel:${SALON.phone}`}>{SALON.phone}</a></p>
          <p>{SALON.email}</p>
          <p>{SALON.hours}</p>
        </div>
        <div>
          <p>Instagram: {SALON.instagram}</p>
          <p><Link to="/crm">Вход для сотрудников</Link></p>
        </div>
      </footer>
    </div>
  )
}

function BookingForm({ preset }) {
  const { bookFromLanding } = useStore()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    serviceId: preset || SERVICES[0].id,
    masterId: '',
    date: todayKey(),
    time: '15:00',
    comment: '',
  })
  const [sent, setSent] = useState(false)

  const service = SERVICES.find((s) => s.id === form.serviceId)
  const masters = useMemo(() => MASTERS.filter((m) => m.categories.includes(service.category)), [service])
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    bookFromLanding({ ...form, masterId: form.masterId || masters[0].id })
    setSent(true)
  }

  return (
    <section className="section booking" id="booking">
      <div className="booking-card">
        <div className="booking-info">
          <h2>Онлайн-запись</h2>
          <p>Оставьте заявку — администратор подтвердит время в течение 15 минут.</p>
          <p className="hint">Демо: заявка сразу появится в <Link to="/crm/appointments">CRM → Записи</Link> со статусом «Новая».</p>
        </div>
        {sent ? (
          <div className="sent">
            <div className="check">✓</div>
            <h3>Спасибо, {form.name.split(' ')[0]}!</h3>
            <p>Мы записали вас на «{service.name}». Скоро перезвоним.</p>
            <button className="btn ghost" onClick={() => setSent(false)}>Новая заявка</button>
          </div>
        ) : (
          <form onSubmit={submit} className="booking-form">
            <label>Имя<input required value={form.name} onChange={set('name')} placeholder="Анна" /></label>
            <label>Телефон<input required value={form.phone} onChange={set('phone')} placeholder="+7 (700) 000-00-00" /></label>
            <label className="wide">Услуга
              <select value={form.serviceId} onChange={(e) => setForm((f) => ({ ...f, serviceId: e.target.value, masterId: '' }))}>
                {CATEGORIES.map((c) => (
                  <optgroup key={c.id} label={c.name}>
                    {SERVICES.filter((s) => s.category === c.id).map((s) => (
                      <option key={s.id} value={s.id}>{s.name} — {money(s.price)}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="wide">Мастер
              <select value={form.masterId} onChange={set('masterId')}>
                <option value="">Любой свободный</option>
                {masters.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </label>
            <label>Дата<input type="date" required min={todayKey()} value={form.date} onChange={set('date')} /></label>
            <label>Время
              <select value={form.time} onChange={set('time')}>
                {SLOT_TIMES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="wide">Комментарий<textarea rows="2" value={form.comment} onChange={set('comment')} placeholder="Пожелания" /></label>
            <button className="btn wide" type="submit">Отправить заявку</button>
          </form>
        )}
      </div>
    </section>
  )
}
