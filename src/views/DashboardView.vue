<template>
  <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
    <div>
      <h1 class="h4 mb-1 fw-bold">
        <i class="fa-solid fa-gauge-high me-2"></i>
        대시보드
      </h1>
      <div class="text-muted small">
        이번 달 흐름을 한 눈에 확인하세요.
        <span class="ms-1"><i class="fa-solid fa-fire-flame-curved"></i></span>
        <span class="ms-1"><i class="fa-solid fa-bolt"></i></span>
        <span class="ms-1"><i class="fa-solid fa-coins"></i></span>
      </div>
    </div>
    <div class="d-flex gap-2">
      <RouterLink class="btn btn-outline-primary btn-sm" :to="{ name: 'ledger' }">
        <i class="fa-solid fa-pen-to-square me-1"></i> 기록하기
      </RouterLink>
      <button class="btn btn-outline-primary btn-sm" type="button" @click="seedDemo" :disabled="busy">
        <i class="fa-solid fa-wand-magic-sparkles me-1"></i> 데모 데이터
      </button>
    </div>
  </div>

  <div class="card border-0 shadow-sm mb-3">
    <div class="card-body p-3 p-md-4">
      <div class="row g-2 align-items-end">
        <div class="col-12 col-md-4">
          <label class="form-label small text-muted mb-1">
            <i class="fa-regular fa-calendar me-1"></i> 시작일
          </label>
          <input v-model="filters.from" type="date" class="form-control" />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small text-muted mb-1">
            <i class="fa-regular fa-calendar-check me-1"></i> 종료일
          </label>
          <input v-model="filters.to" type="date" class="form-control" />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small text-muted mb-1">빠른 선택</label>
          <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-outline-primary btn-sm" type="button" @click="setThisMonth">
              <i class="fa-solid fa-calendar-day me-1"></i> 이번달
            </button>
            <button class="btn btn-outline-primary btn-sm" type="button" @click="setLast3Months">
              <i class="fa-solid fa-calendar-week me-1"></i> 최근 3개월
            </button>
            <button class="btn btn-outline-primary btn-sm" type="button" @click="clearRange">
              <i class="fa-solid fa-infinity me-1"></i> 전체
            </button>
          </div>
        </div>
      </div>

      <div class="small text-muted mt-2">
        <i class="fa-solid fa-filter me-1"></i>
        기간 필터가 적용된 데이터로 KPI/차트가 갱신됩니다.
      </div>
    </div>
  </div>

  <div class="row g-3 mb-3">
    <div class="col-12 col-md-4">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-body p-4">
          <div class="d-flex align-items-center justify-content-between">
            <div class="text-muted small">총 수입</div>
            <i class="fa-solid fa-arrow-trend-up text-success"></i>
          </div>
          <div class="fs-4 fw-bold mt-1">{{ fmt(summary.income) }}</div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-4">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-body p-4">
          <div class="d-flex align-items-center justify-content-between">
            <div class="text-muted small">총 지출</div>
            <i class="fa-solid fa-arrow-trend-down text-danger"></i>
          </div>
          <div class="fs-4 fw-bold mt-1">{{ fmt(summary.expense) }}</div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-4">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-body p-4">
          <div class="d-flex align-items-center justify-content-between">
            <div class="text-muted small">순이익</div>
            <i class="fa-solid fa-scale-balanced" :class="summary.net >= 0 ? 'text-success' : 'text-danger'"></i>
          </div>
          <div class="fs-4 fw-bold mt-1" :class="summary.net >= 0 ? 'text-success' : 'text-danger'">
            {{ fmt(summary.net) }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="filteredEntries.length === 0" class="card border-0 shadow-sm">
    <div class="card-body p-4 p-md-5 text-center">
      <div class="display-6 mb-2">
        <i class="fa-solid fa-face-smile-wink text-primary"></i>
      </div>
      <div class="fw-semibold mb-1">아직 데이터가 없어요</div>
      <div class="text-muted small mb-3">
        선택한 기간에 해당하는 기록이 없습니다. 기간을 바꾸거나 가계부 기록을 추가해보세요.
      </div>
      <div class="d-flex justify-content-center gap-2">
        <RouterLink class="btn btn-primary" :to="{ name: 'ledger' }">
          <i class="fa-solid fa-circle-plus me-1"></i> 가계부로 이동
        </RouterLink>
        <button class="btn btn-outline-primary" type="button" @click="seedDemo" :disabled="busy">
          <i class="fa-solid fa-wand-magic-sparkles me-1"></i> 데모 데이터 넣기
        </button>
      </div>
    </div>
  </div>

  <div v-else class="row g-3">
    <div class="col-12">
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div class="fw-semibold">
              <i class="fa-solid fa-chart-column me-2 text-muted"></i>
              월별 지출(Bar)
            </div>
            <div class="small text-muted">
              <i class="fa-regular fa-calendar me-1"></i>{{ monthsLabel }}
            </div>
          </div>
          <div class="chart-wrap">
            <canvas ref="barCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-6">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-body p-4">
          <div class="fw-semibold mb-2">
            <i class="fa-solid fa-chart-pie me-2 text-muted"></i>
            지출 카테고리(Doughnut)
          </div>
          <div class="chart-wrap">
            <canvas ref="doughnutCanvas"></canvas>
          </div>
          <div class="small text-muted mt-2">
            <i class="fa-solid fa-tags me-1"></i> 상위 카테고리 기준으로 집계합니다.
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-6">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-body p-4">
          <div class="fw-semibold mb-2">
            <i class="fa-solid fa-chart-line me-2 text-muted"></i>
            월별 수입/지출(Line)
          </div>
          <div class="chart-wrap">
            <canvas ref="lineCanvas"></canvas>
          </div>
          <div class="small text-muted mt-2">
            <i class="fa-solid fa-circle-nodes me-1"></i> 월 단위 합계 추이를 보여줍니다.
          </div>
        </div>
      </div>
    </div>
  </div>

  <LoadingOverlay :show="busy" title="대시보드 갱신 중" message="차트를 렌더링하고 있습니다." />
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import Chart from 'chart.js/auto'
import LoadingOverlay from '../components/ui/LoadingOverlay.vue'
import { getEntries, groupByMonth, groupExpenseByCategory, seedIfEmpty, summarize } from '../lib/ledger'

const busy = ref(false)
const entries = ref([])

const filters = reactive({
  from: '',
  to: ''
})

const barCanvas = ref(null)
const doughnutCanvas = ref(null)
const lineCanvas = ref(null)

let barChart = null
let doughnutChart = null
let lineChart = null

const filteredEntries = computed(() => {
  return entries.value.filter((e) => {
    if (filters.from && e.date < filters.from) return false
    if (filters.to && e.date > filters.to) return false
    return true
  })
})

const summary = computed(() => summarize(filteredEntries.value))

const monthsLabel = computed(() => {
  const grouped = groupByMonth(filteredEntries.value)
  if (grouped.length === 0) return '—'
  if (grouped.length === 1) return grouped[0].month
  return `${grouped[0].month} ~ ${grouped[grouped.length - 1].month}`
})

function fmt(n) {
  return `${Number(n || 0).toLocaleString()}원`
}

function reload() {
  entries.value = getEntries()
}

function destroyCharts() {
  if (barChart) barChart.destroy()
  if (doughnutChart) doughnutChart.destroy()
  if (lineChart) lineChart.destroy()
  barChart = null
  doughnutChart = null
  lineChart = null
}

function palette() {
  return [
    '#FF7A00',
    '#FFB000',
    '#FF4D4D',
    '#4C6FFF',
    '#00C2A8',
    '#7C4DFF',
    '#2ECC71',
    '#2D2A32'
  ]
}

async function renderCharts() {
  destroyCharts()
  if (filteredEntries.value.length === 0) return
  await nextTick()

  const monthly = groupByMonth(filteredEntries.value)
  const labels = monthly.map((m) => m.month)
  const monthlyExpense = monthly.map((m) => m.expense)
  const monthlyIncome = monthly.map((m) => m.income)

  const byCat = groupExpenseByCategory(filteredEntries.value).slice(0, 8)
  const catLabels = byCat.map((c) => c.category)
  const catTotals = byCat.map((c) => c.total)

  const colors = palette()

  const common = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { usePointStyle: true, boxWidth: 8 } },
      tooltip: {
        callbacks: {
          label(ctx) {
            const v = Number(ctx.raw || 0)
            return `${ctx.dataset.label ? ctx.dataset.label + ': ' : ''}${v.toLocaleString()}원`
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback(v) {
            return `${Number(v).toLocaleString()}`
          }
        }
      }
    }
  }

  if (barCanvas.value) {
    barChart = new Chart(barCanvas.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '지출',
            data: monthlyExpense,
            backgroundColor: 'rgba(255, 122, 0, 0.24)',
            borderColor: 'rgba(255, 122, 0, 0.85)',
            borderWidth: 1.5,
            borderRadius: 10
          }
        ]
      },
      options: {
        ...common,
        scales: {
          ...common.scales,
          x: { grid: { display: false } }
        }
      }
    })
  }

  if (doughnutCanvas.value) {
    doughnutChart = new Chart(doughnutCanvas.value, {
      type: 'doughnut',
      data: {
        labels: catLabels,
        datasets: [
          {
            label: '지출',
            data: catTotals,
            backgroundColor: catTotals.map((_, i) => colors[i % colors.length]),
            borderColor: 'rgba(255,255,255,0.75)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
          tooltip: common.plugins.tooltip
        },
        cutout: '62%'
      }
    })
  }

  if (lineCanvas.value) {
    lineChart = new Chart(lineCanvas.value, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '수입',
            data: monthlyIncome,
            borderColor: '#00C2A8',
            backgroundColor: 'rgba(0, 194, 168, 0.12)',
            tension: 0.35,
            fill: true,
            pointRadius: 3
          },
          {
            label: '지출',
            data: monthlyExpense,
            borderColor: '#FF7A00',
            backgroundColor: 'rgba(255, 122, 0, 0.10)',
            tension: 0.35,
            fill: true,
            pointRadius: 3
          }
        ]
      },
      options: {
        ...common,
        scales: {
          ...common.scales,
          x: { grid: { display: false } }
        }
      }
    })
  }
}

async function seedDemo() {
  busy.value = true
  try {
    await new Promise((r) => setTimeout(r, 450))
    seedIfEmpty()
    reload()
  } finally {
    busy.value = false
  }
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

function setThisMonth() {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const from = new Date(y, m, 1)
  const to = new Date(y, m + 1, 0)
  filters.from = `${from.getFullYear()}-${pad2(from.getMonth() + 1)}-${pad2(from.getDate())}`
  filters.to = `${to.getFullYear()}-${pad2(to.getMonth() + 1)}-${pad2(to.getDate())}`
}

function setLast3Months() {
  const now = new Date()
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const from = new Date(now.getFullYear(), now.getMonth() - 2, 1)
  filters.from = `${from.getFullYear()}-${pad2(from.getMonth() + 1)}-${pad2(from.getDate())}`
  filters.to = `${to.getFullYear()}-${pad2(to.getMonth() + 1)}-${pad2(to.getDate())}`
}

function clearRange() {
  filters.from = ''
  filters.to = ''
}

watch(
  [entries, () => filters.from, () => filters.to],
  async () => {
    busy.value = true
    try {
      await new Promise((r) => setTimeout(r, 250))
      await renderCharts()
    } finally {
      busy.value = false
    }
  },
  { deep: true }
)

onMounted(async () => {
  reload()
  setThisMonth()
  await renderCharts()
})

onBeforeUnmount(() => {
  destroyCharts()
})
</script>

<style scoped>
.chart-wrap {
  height: 280px;
}
</style>

