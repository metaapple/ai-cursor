<template>
  <header class="border-bottom bg-white sticky-top">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <button class="btn btn-link p-0 text-decoration-none" type="button" @click="onBrandClick">
          <span class="d-flex align-items-center gap-2">
            <img :src="kbLogoUrl" alt="KB" class="brand-logo" />
            <span class="fw-semibold brand-title">국민은행 가계부</span>
          </span>
        </button>

        <div class="ms-auto d-flex align-items-center gap-2 flex-wrap justify-content-end">
          <RouterLink
            :to="{ name: 'dashboard' }"
            class="btn btn-sm"
            :class="route.name === 'dashboard' ? 'btn-primary' : 'btn-outline-primary'"
          >
            <i class="fa-solid fa-gauge-high me-1"></i> 대시보드
          </RouterLink>
          <RouterLink
            :to="{ name: 'ledger' }"
            class="btn btn-sm"
            :class="route.name === 'ledger' ? 'btn-primary' : 'btn-outline-primary'"
          >
            <i class="fa-solid fa-receipt me-1"></i> 가계부
          </RouterLink>
          <template v-if="!isLoggedIn">
            <RouterLink
              :to="{ name: 'login' }"
              class="btn btn-sm"
              :class="route.name === 'login' ? 'btn-primary' : 'btn-outline-primary'"
            >
              <i class="fa-solid fa-right-to-bracket me-1"></i> 로그인
            </RouterLink>
            <RouterLink
              :to="{ name: 'signup' }"
              class="btn btn-sm"
              :class="route.name === 'signup' ? 'btn-primary' : 'btn-outline-primary'"
            >
              <i class="fa-solid fa-user-plus me-1"></i> 회원가입
            </RouterLink>
          </template>

          <template v-else>
            <div class="d-flex align-items-center gap-2">
              <div class="d-none d-md-flex align-items-center gap-2 px-2 py-1 rounded-3 bg-light border">
                <i class="fa-solid fa-user text-muted"></i>
                <div class="small fw-semibold">{{ currentMemberName }}</div>
              </div>
              <button class="btn btn-sm btn-outline-primary" type="button" @click="onLogout">
                <i class="fa-solid fa-right-from-bracket me-1"></i> 로그아웃
              </button>
            </div>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import kbLogoUrl from '../../assets/kb-logo.svg'
import { useMembersStore } from '../../stores/members'

const route = useRoute()
const router = useRouter()
const members = useMembersStore()

const isLoggedIn = computed(() => members.isLoggedIn)
const currentMemberName = computed(() => members.currentMember?.name || '사용자')

const nextRouteNameOnBrandClick = computed(() => {
  if (route.name === 'login') return 'signup'
  return 'login'
})

function onBrandClick() {
  router.push({ name: nextRouteNameOnBrandClick.value })
}

function onLogout() {
  members.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.brand-logo {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(255, 122, 0, 0.18);
}
.brand-title {
  color: var(--kb-ink);
  letter-spacing: -0.02em;
}
</style>

