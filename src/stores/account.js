import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiFetch, toQuery } from '../lib/api'
import { useMembersStore } from './members'

export const useAccountStore = defineStore('account', () => {
  const entries = ref([])
  const loading = ref(false)
  const error = ref('')

  const members = useMembersStore()

  const memberId = computed(() => members.currentMember?.id || null)

  const summary = computed(() => {
    let income = 0
    let expense = 0
    for (const e of entries.value) {
      if (e.type === 'income') income += Number(e.amount || 0)
      else expense += Number(e.amount || 0)
    }
    return { income, expense, net: income - expense }
  })

  async function fetchEntries({ forMemberId } = {}) {
    const mid = forMemberId ?? memberId.value
    if (!mid) {
      entries.value = []
      return []
    }

    loading.value = true
    error.value = ''
    try {
      const query = toQuery({ memberId: mid, _sort: 'date', _order: 'desc' })
      entries.value = await apiFetch(`/ledgerEntries${query}`)
      return entries.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : '가계부 조회 실패'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function addEntry(payload) {
    const mid = memberId.value
    if (!mid) throw new Error('로그인이 필요합니다.')

    loading.value = true
    error.value = ''
    try {
      const body = {
        memberId: mid,
        type: payload.type,
        amount: Number(payload.amount),
        category: String(payload.category || '').trim(),
        note: String(payload.note || '').trim(),
        date: String(payload.date || '').slice(0, 10),
        createdAt: new Date().toISOString()
      }
      const created = await apiFetch('/ledgerEntries', { method: 'POST', body: JSON.stringify(body) })
      await fetchEntries()
      return created
    } catch (e) {
      error.value = e instanceof Error ? e.message : '가계부 추가 실패'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateEntry(id, patch) {
    const mid = memberId.value
    if (!mid) throw new Error('로그인이 필요합니다.')

    loading.value = true
    error.value = ''
    try {
      const existing = entries.value.find((e) => e.id === id)
      if (!existing) throw new Error('수정할 항목을 찾을 수 없습니다.')
      if (existing.memberId !== mid) throw new Error('다른 사용자의 항목은 수정할 수 없습니다.')

      const body = {
        ...existing,
        ...patch,
        amount: patch.amount !== undefined ? Number(patch.amount) : existing.amount,
        category: patch.category !== undefined ? String(patch.category || '').trim() : existing.category,
        note: patch.note !== undefined ? String(patch.note || '').trim() : existing.note,
        date: patch.date !== undefined ? String(patch.date || '').slice(0, 10) : existing.date
      }

      const updated = await apiFetch(`/ledgerEntries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body)
      })
      await fetchEntries()
      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : '가계부 수정 실패'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteEntry(id) {
    const mid = memberId.value
    if (!mid) throw new Error('로그인이 필요합니다.')

    loading.value = true
    error.value = ''
    try {
      const existing = entries.value.find((e) => e.id === id)
      if (existing && existing.memberId !== mid) throw new Error('다른 사용자의 항목은 삭제할 수 없습니다.')

      await apiFetch(`/ledgerEntries/${id}`, { method: 'DELETE' })
      await fetchEntries()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '가계부 삭제 실패'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    entries,
    loading,
    error,
    summary,
    fetchEntries,
    addEntry,
    updateEntry,
    deleteEntry
  }
})

