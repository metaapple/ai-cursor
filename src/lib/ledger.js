const STORAGE_KEY = 'kb-ledger-v1'

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json)
    return v ?? fallback
  } catch {
    return fallback
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeEntry(entry) {
  const type = entry.type === 'income' ? 'income' : 'expense'
  const amount = Number(entry.amount)
  const category = String(entry.category || '').trim() || (type === 'income' ? '기타수입' : '기타지출')
  const note = String(entry.note || '').trim()
  const date = String(entry.date || '').slice(0, 10)
  const id = String(entry.id || uid())

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('금액은 0보다 커야 합니다.')
  }
  if (!date) {
    throw new Error('날짜를 입력해주세요.')
  }

  return { id, type, amount, category, note, date }
}

export function seedIfEmpty() {
  const existing = getEntries()
  if (existing.length > 0) return

  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const d0 = `${yyyy}-${mm}-${dd}`

  const demo = [
    { type: 'income', amount: 3200000, category: '월급', note: '급여', date: d0 },
    { type: 'expense', amount: 5800, category: '카페', note: '아메리카노', date: d0 },
    { type: 'expense', amount: 42000, category: '식비', note: '점심', date: d0 },
    { type: 'expense', amount: 125000, category: '교통', note: '정기권', date: d0 }
  ].map((e) => normalizeEntry(e))

  setEntries(demo)
}

export function getEntries() {
  const raw = localStorage.getItem(STORAGE_KEY)
  const entries = safeParse(raw, [])
  return Array.isArray(entries) ? entries : []
}

export function setEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function addEntry(entry) {
  const normalized = normalizeEntry(entry)
  const entries = getEntries()
  setEntries([normalized, ...entries])
  return normalized
}

export function updateEntry(id, patch) {
  const entries = getEntries()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx < 0) throw new Error('수정할 항목을 찾을 수 없습니다.')

  const next = normalizeEntry({ ...entries[idx], ...patch, id })
  const copy = entries.slice()
  copy[idx] = next
  setEntries(copy)
  return next
}

export function deleteEntry(id) {
  const entries = getEntries()
  setEntries(entries.filter((e) => e.id !== id))
}

export function clearAll() {
  localStorage.removeItem(STORAGE_KEY)
}

export function summarize(entries) {
  let income = 0
  let expense = 0
  for (const e of entries) {
    if (e.type === 'income') income += e.amount
    else expense += e.amount
  }
  return { income, expense, net: income - expense }
}

export function groupByMonth(entries) {
  const map = new Map()
  for (const e of entries) {
    const key = e.date.slice(0, 7)
    const prev = map.get(key) || { income: 0, expense: 0 }
    if (e.type === 'income') prev.income += e.amount
    else prev.expense += e.amount
    map.set(key, prev)
  }
  const keys = Array.from(map.keys()).sort()
  return keys.map((k) => ({ month: k, ...map.get(k) }))
}

export function groupExpenseByCategory(entries) {
  const map = new Map()
  for (const e of entries) {
    if (e.type !== 'expense') continue
    map.set(e.category, (map.get(e.category) || 0) + e.amount)
  }
  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

