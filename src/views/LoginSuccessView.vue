<template>
  <div class="card border-0 shadow-sm success-card">
    <div class="card-body p-4 p-md-5">
      <div class="d-flex align-items-center justify-content-between gap-3">
        <div>
          <h1 class="h4 mb-1 fw-bold">로그인 성공</h1>
          <div class="text-muted small">환영합니다. 오늘의 지출을 간단히 정리해볼까요?</div>
        </div>
        <div class="success-badge">
          <span class="check">✓</span>
        </div>
      </div>

      <div class="mt-4 p-3 rounded-3 info-surface">
        <div class="small text-muted mb-1">로그인 계정</div>
        <div class="fw-semibold">{{ displayEmail }}</div>
      </div>

      <div class="d-grid gap-2 mt-4">
        <button class="btn btn-primary btn-lg" type="button" @click="goLogin">
          다시 로그인 화면으로
        </button>
        <button class="btn btn-outline-primary" type="button" @click="goSignup">
          다른 계정 만들기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const displayEmail = computed(() => {
  const raw = route.query.email
  return typeof raw === 'string' && raw.length > 0 ? raw : '알 수 없음'
})

function goLogin() {
  router.push({ name: 'login', query: { email: displayEmail.value } })
}

function goSignup() {
  router.push({ name: 'signup' })
}
</script>

<style scoped>
.success-card {
  border-radius: 18px;
}
.success-badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(255, 122, 0, 0.12);
  color: var(--kb-orange-700);
  border: 1px solid rgba(255, 122, 0, 0.22);
}
.check {
  font-weight: 900;
  font-size: 22px;
  line-height: 1;
}
.info-surface {
  background: rgba(255, 122, 0, 0.06);
  border: 1px solid rgba(255, 122, 0, 0.14);
}
</style>

