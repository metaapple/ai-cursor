<template>
  <div class="card border-0 shadow-sm auth-card">
    <div class="card-body p-4 p-md-5">
      <div class="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h1 class="h4 mb-1 fw-bold">로그인</h1>
          <div class="text-muted small">가계부를 안전하게 관리하세요.</div>
        </div>
        <span class="badge rounded-pill text-bg-light border">KB</span>
      </div>

      <div v-if="signupNotice" class="alert alert-success py-2 mt-3 mb-0" role="status">
        {{ signupNotice }}
      </div>

      <form class="mt-4" @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="form-label">이메일</label>
          <input
            v-model.trim="email"
            type="email"
            class="form-control form-control-lg"
            placeholder="name@example.com"
            autocomplete="email"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">비밀번호</label>
          <input
            v-model="password"
            type="password"
            class="form-control form-control-lg"
            placeholder="••••••••"
            autocomplete="current-password"
            required
            minlength="8"
          />
        </div>

        <div v-if="error" class="alert alert-danger py-2" role="alert">
          {{ error }}
        </div>

        <button class="btn btn-primary btn-lg w-100 mt-2" type="submit" :disabled="loading">
          로그인
        </button>

        <div class="d-flex justify-content-between align-items-center mt-3 small">
          <span class="text-muted">계정이 없으신가요?</span>
          <RouterLink class="link-primary fw-semibold" :to="{ name: 'signup' }">회원가입</RouterLink>
        </div>
      </form>
    </div>
  </div>

  <LoadingOverlay
    :show="loading"
    title="로그인 중"
    message="보안 연결을 확인하고 있습니다."
  />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import LoadingOverlay from '../components/ui/LoadingOverlay.vue'
import { useMembersStore } from '../stores/members'

const route = useRoute()
const router = useRouter()
const members = useMembersStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const signupNotice = computed(() => {
  if (route.query.justSignedUp === '1') return '회원가입이 완료되었습니다. 로그인 해주세요.'
  return ''
})

onMounted(() => {
  const qEmail = route.query.email
  if (typeof qEmail === 'string' && qEmail.length > 0) {
    email.value = qEmail
  }
})

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await members.login({ email: email.value, password: password.value })
    await router.push({ name: 'login-success', query: { email: email.value } })
  } catch (e) {
    error.value = e instanceof Error ? e.message : '로그인에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card {
  border-radius: 18px;
}
</style>

