import { createRouter, createWebHistory } from 'vue-router'

const LoginView = () => import('../views/LoginView.vue')
const SignupView = () => import('../views/SignupView.vue')
const LoginSuccessView = () => import('../views/LoginSuccessView.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const LedgerView = () => import('../views/LedgerView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    { path: '/login-success', name: 'login-success', component: LoginSuccessView },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    { path: '/ledger', name: 'ledger', component: LedgerView },
    { path: '/:pathMatch(.*)*', redirect: '/login' }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router

