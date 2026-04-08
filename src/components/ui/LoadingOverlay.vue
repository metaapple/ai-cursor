<template>
  <div v-if="show" class="overlay" role="status" aria-live="polite" aria-busy="true">
    <div class="card shadow-sm border-0 spinner-card">
      <div class="card-body d-flex align-items-center gap-3">
        <div class="spinner-border text-primary" aria-hidden="true"></div>
        <div>
          <div class="fw-semibold">{{ title }}</div>
          <div class="small text-muted">{{ message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '처리 중' },
  message: { type: String, default: '잠시만 기다려주세요.' }
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 18, 28, 0.42);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 2000;
  padding: 24px;
}
.spinner-card {
  width: min(520px, 100%);
  border-radius: 16px;
}
</style>

