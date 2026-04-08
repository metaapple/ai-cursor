<template>
  <footer class="border-top bg-white">
    <div class="container py-3">
      <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
        <div class="small text-muted">
          © {{ year }} KB Household Ledger (Demo)
        </div>
        <div class="small text-muted">
          Vue 3 · Composition API · Bootstrap · Router
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

