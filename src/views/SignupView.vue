<template>
  <div class="card border-0 shadow-sm auth-card">
    <div class="card-body p-4 p-md-5">
      <div class="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h1 class="h4 mb-1 fw-bold">회원가입</h1>
          <div class="text-muted small">3분 만에 시작할 수 있어요.</div>
        </div>
        <span class="badge rounded-pill text-bg-light border">KB</span>
      </div>

      <form class="mt-4" @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="form-label">이름</label>
          <input
            v-model.trim="name"
            type="text"
            class="form-control form-control-lg"
            placeholder="홍길동"
            autocomplete="name"
            required
            minlength="2"
          />
        </div>

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
            placeholder="8자 이상"
            autocomplete="new-password"
            required
            minlength="8"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">비밀번호 확인</label>
          <input
            v-model="passwordConfirm"
            type="password"
            class="form-control form-control-lg"
            placeholder="비밀번호 재입력"
            autocomplete="new-password"
            required
            minlength="8"
          />
        </div>

        <div v-if="error" class="alert alert-danger py-2" role="alert">
          {{ error }}
        </div>

        <button class="btn btn-primary btn-lg w-100 mt-2" type="submit" :disabled="loading">
          회원가입
        </button>

        <div class="d-flex justify-content-between align-items-center mt-3 small">
          <span class="text-muted">이미 계정이 있으신가요?</span>
          <RouterLink class="link-primary fw-semibold" :to="{ name: 'login' }">로그인</RouterLink>
        </div>
      </form>
    </div>
  </div>

  <LoadingOverlay
    :show="loading"
    title="회원가입 중"
    message="가입 정보를 확인하고 있습니다."
  />
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import LoadingOverlay from '../components/ui/LoadingOverlay.vue'
import { useMembersStore } from '../stores/members'

const router = useRouter()
const members = useMembersStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    if (name.value.trim().length < 2) throw new Error('이름은 2자 이상 입력해주세요.')
    if (!email.value.includes('@')) throw new Error('이메일 형식이 올바르지 않습니다.')
    if (password.value.length < 8) throw new Error('비밀번호는 8자 이상이어야 합니다.')
    if (password.value !== passwordConfirm.value) throw new Error('비밀번호가 일치하지 않습니다.')

    await members.signup({ name: name.value, email: email.value, password: password.value })
    await router.push({ name: 'login', query: { justSignedUp: '1', email: email.value } })
  } catch (e) {
    error.value = e instanceof Error ? e.message : '회원가입에 실패했습니다.'
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

