import { createContext, useContext, useEffect, useState } from 'react'
import { APPOINTMENTS, CLIENTS, MASTERS, SERVICES, SALON } from '../data/mock'

// Простое хранилище в памяти + localStorage. Заявки с лендинга попадают сюда же,
// так что их сразу видно в CRM.
const KEY = 'lumiere-crm-v1'
const StoreContext = createContext(null)

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* хранилище недоступно — работаем на мокап-данных */
  }
  return { clients: CLIENTS, appointments: APPOINTMENTS }
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const api = {
    ...state,
    masters: MASTERS,
    services: SERVICES,
    addClient(client) {
      const c = { id: `c${Date.now()}`, tags: ['Новый'], email: '', note: '', source: 'Сайт', birthday: '', createdAt: new Date().toISOString().slice(0, 10), ...client }
      setState((s) => ({ ...s, clients: [c, ...s.clients] }))
      return c
    },
    updateClient(id, patch) {
      setState((s) => ({ ...s, clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
    },
    addAppointment(a) {
      const svc = SERVICES.find((x) => x.id === a.serviceId)
      const item = { id: `a${Date.now()}`, status: 'new', comment: '', price: svc?.price ?? 0, ...a }
      setState((s) => ({ ...s, appointments: [...s.appointments, item] }))
      return item
    },
    updateAppointment(id, patch) {
      setState((s) => ({ ...s, appointments: s.appointments.map((a) => (a.id === id ? { ...a, ...patch } : a)) }))
    },
    deleteAppointment(id) {
      setState((s) => ({ ...s, appointments: s.appointments.filter((a) => a.id !== id) }))
    },
    // Заявка с лендинга: находим клиента по телефону или создаём нового
    bookFromLanding({ name, phone, serviceId, masterId, date, time, comment }) {
      setState((s) => {
        let client = s.clients.find((c) => c.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''))
        let clients = s.clients
        if (!client) {
          client = { id: `c${Date.now()}`, name, phone, email: '', tags: ['Новый'], note: '', source: 'Сайт', birthday: '', createdAt: new Date().toISOString().slice(0, 10) }
          clients = [client, ...clients]
        }
        const svc = SERVICES.find((x) => x.id === serviceId)
        const appt = { id: `a${Date.now()}`, date, time, clientId: client.id, masterId, serviceId, price: svc?.price ?? 0, status: 'new', comment: comment || 'Заявка с сайта' }
        return { clients, appointments: [...s.appointments, appt] }
      })
    },
    reset() {
      setState({ clients: CLIENTS, appointments: APPOINTMENTS })
    },
  }

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)

export const money = (n) => `${Number(n).toLocaleString('ru-RU')} ${SALON.currency}`
export const fmtDate = (d, opts = { day: 'numeric', month: 'long' }) => new Date(d + 'T00:00:00').toLocaleDateString('ru-RU', opts)
export const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
