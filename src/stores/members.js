import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiFetch, toQuery } from '../lib/api'

const SESSION_KEY = 'kb-session-member-v1'

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(member) {
  if (!member) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(member))
}

export const useMembersStore = defineStore('members', () => {
  const currentMember = ref(loadSession())
  const members = ref([])
  const loading = ref(false)
  const error = ref('')

  const isLoggedIn = computed(() => !!currentMember.value?.id)

  async function fetchMembers({ q = '', limit = 50 } = {}) {
    loading.value = true
    error.value = ''
    try {
      const query = toQuery({ q, _limit: limit, _sort: 'id', _order: 'asc' })
      members.value = await apiFetch(`/members${query}`)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '회원 목록 조회 실패'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function signup({ name, email, password }) {
    loading.value = true
    error.value = ''
    try {
      // 중복 이메일 체크
      const existing = await apiFetch(`/members${toQuery({ email })}`)
      if (Array.isArray(existing) && existing.length > 0) {
        throw new Error('이미 사용 중인 이메일입니다.')
      }

      const payload = {
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      }

      const created = await apiFetch('/members', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      return created
    } catch (e) {
      error.value = e instanceof Error ? e.message : '회원가입 실패'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function login({ email, password }) {
    loading.value = true
    error.value = ''
    try {
      const list = await apiFetch(`/members${toQuery({ email, password })}`)
      const member = Array.isArray(list) ? list[0] : null
      if (!member) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')

      currentMember.value = { id: member.id, name: member.name, email: member.email }
      saveSession(currentMember.value)
      return currentMember.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : '로그인 실패'
      throw e
    } finally {
      loading.value = false
    }
  }

  function logout() {
    currentMember.value = null
    saveSession(null)
  }

  return {
    members,
    currentMember,
    isLoggedIn,
    loading,
    error,
    fetchMembers,
    signup,
    login,
    logout
  }
})

