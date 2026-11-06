// Мокап-данные салона. Даты записей строятся относительно сегодняшнего дня,
// поэтому CRM всегда выглядит «живой».

export const SALON = {
  name: 'Lumière',
  tagline: 'Салон красоты',
  city: 'Алматы',
  address: 'ул. Абая, 52, Алматы',
  phone: '+7 (727) 355-12-40',
  email: 'hello@lumiere-salon.kz',
  hours: 'Ежедневно 09:00 – 21:00',
  instagram: '@lumiere.salon',
  currency: '₸',
}

export const CATEGORIES = [
  { id: 'hair', name: 'Волосы', icon: '✂️' },
  { id: 'nails', name: 'Ногти', icon: '💅' },
  { id: 'face', name: 'Лицо', icon: '🌸' },
  { id: 'brows', name: 'Брови и ресницы', icon: '👁️' },
  { id: 'body', name: 'Массаж и SPA', icon: '🧖' },
]

export const SERVICES = [
  { id: 's1', category: 'hair', name: 'Женская стрижка', duration: 60, price: 12000 },
  { id: 's2', category: 'hair', name: 'Мужская стрижка', duration: 45, price: 7000 },
  { id: 's3', category: 'hair', name: 'Окрашивание в один тон', duration: 120, price: 25000 },
  { id: 's4', category: 'hair', name: 'Airtouch / балаяж', duration: 240, price: 55000 },
  { id: 's5', category: 'hair', name: 'Укладка', duration: 45, price: 8000 },
  { id: 's6', category: 'nails', name: 'Маникюр с покрытием', duration: 90, price: 9000 },
  { id: 's7', category: 'nails', name: 'Педикюр с покрытием', duration: 90, price: 12000 },
  { id: 's8', category: 'nails', name: 'Наращивание ногтей', duration: 150, price: 18000 },
  { id: 's9', category: 'face', name: 'Чистка лица', duration: 75, price: 15000 },
  { id: 's10', category: 'face', name: 'Уходовая процедура', duration: 60, price: 13000 },
  { id: 's11', category: 'face', name: 'Пилинг', duration: 45, price: 11000 },
  { id: 's12', category: 'brows', name: 'Ламинирование бровей', duration: 60, price: 8000 },
  { id: 's13', category: 'brows', name: 'Ламинирование ресниц', duration: 75, price: 9000 },
  { id: 's14', category: 'brows', name: 'Коррекция и окрашивание бровей', duration: 40, price: 5000 },
  { id: 's15', category: 'body', name: 'Классический массаж', duration: 60, price: 14000 },
  { id: 's16', category: 'body', name: 'SPA-программа для тела', duration: 120, price: 28000 },
]

export const MASTERS = [
  { id: 'm1', name: 'Алина Сейткали', role: 'Топ-стилист', categories: ['hair'], experience: 9, rating: 4.9, color: '#c97b84', photo: 'АС', schedule: 'Пн–Пт' },
  { id: 'm2', name: 'Дарья Ким', role: 'Колорист', categories: ['hair'], experience: 6, rating: 4.8, color: '#b08968', photo: 'ДК', schedule: 'Вт–Сб' },
  { id: 'm3', name: 'Мадина Нурланова', role: 'Мастер ногтевого сервиса', categories: ['nails'], experience: 5, rating: 4.9, color: '#9d8189', photo: 'МН', schedule: 'Пн–Сб' },
  { id: 'm4', name: 'Екатерина Орлова', role: 'Мастер ногтевого сервиса', categories: ['nails'], experience: 3, rating: 4.7, color: '#7f9c96', photo: 'ЕО', schedule: 'Ср–Вс' },
  { id: 'm5', name: 'Айгерим Жанибек', role: 'Косметолог', categories: ['face'], experience: 8, rating: 5.0, color: '#6d6875', photo: 'АЖ', schedule: 'Пн–Пт' },
  { id: 'm6', name: 'Софья Ли', role: 'Бровист, лэшмейкер', categories: ['brows'], experience: 4, rating: 4.8, color: '#d4a373', photo: 'СЛ', schedule: 'Вт–Вс' },
  { id: 'm7', name: 'Тимур Ахметов', role: 'Массажист', categories: ['body'], experience: 7, rating: 4.9, color: '#5e7b8c', photo: 'ТА', schedule: 'Пн–Сб' },
]

const FIRST = ['Анна', 'Мария', 'Елена', 'Асель', 'Динара', 'Ольга', 'Камила', 'Жанна', 'Виктория', 'Айша', 'Ксения', 'Сауле', 'Ирина', 'Томирис', 'Полина', 'Алия', 'Наталья', 'Гульнара', 'Юлия', 'Дана', 'Арман', 'Данияр', 'Сергей', 'Ерлан']
const LAST_F = ['Иванова', 'Ахметова', 'Смирнова', 'Касымова', 'Петрова', 'Нурпеисова', 'Ким', 'Волкова', 'Абдрахманова', 'Морозова', 'Сулейменова', 'Попова', 'Жумабаева', 'Лебедева']
const LAST_M = ['Иванов', 'Ахметов', 'Смирнов', 'Касымов', 'Ким', 'Сулейменов']
const SOURCES = ['Instagram', 'Сайт', 'Рекомендация', '2ГИС', 'Пришли сами']
const TAGS = ['VIP', 'Постоянный', 'Новый', 'Любит кофе', 'Аллергия на аммиак', 'Только утро']

// Детерминированный генератор, чтобы данные не менялись при каждой загрузке
function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
const rand = rng(42)
const pick = (arr) => arr[Math.floor(rand() * arr.length)]
const int = (a, b) => a + Math.floor(rand() * (b - a + 1))

export function dayKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function addDays(n) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + n)
  return d
}

export const CLIENTS = Array.from({ length: 40 }, (_, i) => {
  const first = FIRST[i % FIRST.length]
  const male = ['Арман', 'Данияр', 'Сергей', 'Ерлан'].includes(first)
  const last = male ? pick(LAST_M) : pick(LAST_F)
  const tags = rand() > 0.5 ? [pick(TAGS)] : []
  if (rand() > 0.8) tags.push(pick(TAGS))
  return {
    id: `c${i + 1}`,
    name: `${first} ${last}`,
    phone: `+7 (7${int(0, 7)}${int(0, 9)}) ${int(100, 999)}-${int(10, 99)}-${int(10, 99)}`,
    email: rand() > 0.3 ? `client${i + 1}@mail.kz` : '',
    birthday: dayKey(new Date(int(1975, 2004), int(0, 11), int(1, 28))),
    source: pick(SOURCES),
    tags: [...new Set(tags)],
    note: rand() > 0.7 ? 'Предпочитает тихую музыку и зелёный чай.' : '',
    createdAt: dayKey(addDays(-int(10, 700))),
  }
})

const SLOTS = ['09:00', '10:00', '10:30', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30', '16:00', '17:00', '18:00', '19:00']

export const APPOINTMENTS = (() => {
  const list = []
  let id = 1
  for (let day = -60; day <= 14; day++) {
    const count = day < 0 ? int(6, 12) : day === 0 ? 10 : int(2, 8)
    const used = new Set()
    for (let k = 0; k < count; k++) {
      const master = pick(MASTERS)
      const time = pick(SLOTS)
      const key = master.id + time
      if (used.has(key)) continue
      used.add(key)
      const service = pick(SERVICES.filter((s) => master.categories.includes(s.category)))
      let status
      if (day < 0) status = rand() > 0.9 ? 'cancelled' : rand() > 0.95 ? 'no-show' : 'done'
      else if (day === 0) status = time < '13:00' ? 'done' : rand() > 0.3 ? 'confirmed' : 'new'
      else status = rand() > 0.4 ? 'confirmed' : 'new'
      list.push({
        id: `a${id++}`,
        date: dayKey(addDays(day)),
        time,
        clientId: pick(CLIENTS).id,
        masterId: master.id,
        serviceId: service.id,
        price: service.price,
        status,
        comment: rand() > 0.85 ? 'Хочет попробовать новый оттенок' : '',
      })
    }
  }
  return list
})()

export const STATUSES = {
  new: { label: 'Новая', color: '#3b82f6' },
  confirmed: { label: 'Подтверждена', color: '#8b5cf6' },
  done: { label: 'Выполнена', color: '#10b981' },
  cancelled: { label: 'Отменена', color: '#9ca3af' },
  'no-show': { label: 'Не пришёл', color: '#ef4444' },
}

export const REVIEWS = [
  { name: 'Асель К.', text: 'Лучший airtouch в городе! Алина — настоящий художник, цвет держится уже третий месяц.', rating: 5 },
  { name: 'Мария П.', text: 'Хожу на маникюр к Мадине больше года. Аккуратно, быстро, покрытие держится 3+ недели.', rating: 5 },
  { name: 'Жанна С.', text: 'Уютно, вкусный кофе и очень внимательный персонал. Чистка лица у Айгерим — магия.', rating: 5 },
]

export const SLOT_TIMES = SLOTS
