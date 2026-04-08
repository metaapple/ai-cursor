<template>
  <div class="app-shell">
    <AppHeader />
    <main class="content-wrap">
      <div class="container py-4 py-md-5">
        <div class="row justify-content-center">
          <div class="col-12 col-md-10 col-lg-7 col-xl-6">
            <RouterView />
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
  <hr>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.content-wrap {
  flex: 1 1 auto;
}
</style>

