<template>
  <div class="d-flex align-items-center justify-content-between gap-3 mb-3">
    <div>
      <h1 class="h4 mb-1 fw-bold">
        <i class="fa-solid fa-receipt me-2"></i>
        가계부
      </h1>
      <div class="text-muted small">
        수입/지출을 기록하고, 대시보드에서 흐름을 확인하세요.
      </div>
    </div>
    <div class="d-flex gap-2">
      <button class="btn btn-outline-primary btn-sm" type="button" @click="seedDemo" :disabled="busy">
        <i class="fa-solid fa-wand-magic-sparkles me-1"></i> 데모 데이터
      </button>
      <button class="btn btn-outline-primary btn-sm" type="button" @click="onClearAll" :disabled="busy">
        <i class="fa-solid fa-trash-can me-1"></i> 전체삭제
      </button>
    </div>
  </div>

  <div class="card border-0 shadow-sm mb-3">
    <div class="card-body p-4">
      <form class="row g-3" @submit.prevent="onSubmit">
        <div class="col-12 col-md-3">
          <label class="form-label">구분</label>
          <select v-model="form.type" class="form-select form-select-lg" required>
            <option value="expense">지출</option>
            <option value="income">수입</option>
          </select>
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label">날짜</label>
          <input v-model="form.date" type="date" class="form-control form-control-lg" required />
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label">카테고리</label>
          <select
            v-if="!isCustomCategory"
            v-model="form.category"
            class="form-select form-select-lg"
            required
            @change="onCategoryPresetChange"
          >
            <option v-for="c in presetCategories" :key="c" :value="c">{{ c }}</option>
            <option value="__custom__">직접 입력</option>
          </select>
          <input
            v-else
            v-model.trim="form.categoryCustom"
            type="text"
            class="form-control form-control-lg"
            placeholder="카테고리 직접 입력"
            required
          />
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label">금액</label>
          <div class="input-group input-group-lg">
            <span class="input-group-text">₩</span>
            <input
              v-model.number="form.amount"
              type="number"
              class="form-control"
              placeholder="0"
              min="1"
              step="1"
              required
            />
          </div>
        </div>

        <div class="col-12 col-md-9">
          <label class="form-label">메모</label>
          <input v-model.trim="form.note" type="text" class="form-control form-control-lg" placeholder="선택" />
        </div>
        <div class="col-12 col-md-3 d-grid">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <button class="btn btn-primary btn-lg" type="submit" :disabled="busy">
            <i class="fa-solid" :class="editingId ? 'fa-pen-to-square' : 'fa-circle-plus'"></i>
            <span class="ms-2">{{ editingId ? '수정 저장' : '추가' }}</span>
          </button>
          <button
            v-if="editingId"
            class="btn btn-link link-secondary mt-1"
            type="button"
            @click="cancelEdit"
            :disabled="busy"
          >
            <i class="fa-solid fa-xmark me-1"></i> 편집 취소
          </button>
        </div>

        <div v-if="error" class="col-12">
          <div class="alert alert-danger py-2 mb-0" role="alert">
            <i class="fa-solid fa-triangle-exclamation me-2"></i>{{ error }}
          </div>
        </div>
      </form>
    </div>
  </div>

  <div class="card border-0 shadow-sm mb-3">
    <div class="card-body p-4">
      <div class="row g-3 align-items-end">
        <div class="col-12 col-md-3">
          <label class="form-label">기간(시작)</label>
          <input v-model="filters.from" type="date" class="form-control" />
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label">기간(끝)</label>
          <input v-model="filters.to" type="date" class="form-control" />
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label">구분</label>
          <select v-model="filters.type" class="form-select">
            <option value="">전체</option>
            <option value="expense">지출</option>
            <option value="income">수입</option>
          </select>
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label">검색(카테고리/메모)</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
            <input v-model.trim="filters.q" type="text" class="form-control" placeholder="예: 카페" />
          </div>
        </div>
      </div>

      <hr class="my-4" />

      <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
        <div class="small text-muted">
          <i class="fa-solid fa-circle-info me-1"></i>
          총 {{ filtered.length.toLocaleString() }}건 ·
          수입 {{ summary.income.toLocaleString() }}원 ·
          지출 {{ summary.expense.toLocaleString() }}원 ·
          순이익
          <span :class="summary.net >= 0 ? 'text-success' : 'text-danger'">
            {{ summary.net.toLocaleString() }}원
          </span>
        </div>
        <RouterLink class="btn btn-outline-primary btn-sm" :to="{ name: 'dashboard' }">
          <i class="fa-solid fa-chart-line me-1"></i> 대시보드 보기
        </RouterLink>
      </div>

      <div class="table-responsive mt-3">
        <table class="table align-middle">
          <thead>
            <tr class="text-muted small">
              <th style="width: 110px">날짜</th>
              <th style="width: 90px">구분</th>
              <th>카테고리</th>
              <th>메모</th>
              <th class="text-end" style="width: 140px">금액</th>
              <th class="text-end" style="width: 130px">작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="6" class="py-4 text-center text-muted">
                <i class="fa-regular fa-face-smile me-2"></i>
                아직 기록이 없어요. 위에서 추가해보세요.
              </td>
            </tr>
            <tr v-for="e in filtered" :key="e.id">
              <td class="text-muted small">{{ e.date }}</td>
              <td>
                <span class="badge" :class="e.type === 'income' ? 'text-bg-success' : 'text-bg-secondary'">
                  <i class="fa-solid me-1" :class="e.type === 'income' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'"></i>
                  {{ e.type === 'income' ? '수입' : '지출' }}
                </span>
              </td>
              <td class="fw-semibold">
                <i class="fa-solid fa-tag me-2 text-muted"></i>{{ e.category }}
              </td>
              <td class="text-muted">{{ e.note || '-' }}</td>
              <td class="text-end fw-semibold" :class="e.type === 'income' ? 'text-success' : 'text-danger'">
                {{ (e.type === 'income' ? e.amount : -e.amount).toLocaleString() }}원
              </td>
              <td class="text-end">
                <div class="btn-group btn-group-sm" role="group">
                  <button class="btn btn-outline-primary" type="button" @click="startEdit(e)" :disabled="busy">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="btn btn-outline-danger" type="button" @click="onDelete(e)" :disabled="busy">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <LoadingOverlay :show="busy" title="처리 중" message="가계부 데이터를 반영하고 있습니다." />
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import LoadingOverlay from '../components/ui/LoadingOverlay.vue'
import { addEntry, clearAll, deleteEntry, getEntries, seedIfEmpty, summarize, updateEntry } from '../lib/ledger'

const busy = ref(false)
const error = ref('')

const entries = ref([])
const editingId = ref('')

const incomeCategories = ['월급', '부수입', '이자', '배당', '용돈', '기타수입']
const expenseCategories = ['카페', '식비', '교통', '통신', '쇼핑', '주거', '생활', '기타지출']

const presetCategories = computed(() => {
  return form.type === 'income' ? incomeCategories : expenseCategories
})

const isCustomCategory = ref(false)

const form = reactive({
  type: 'expense',
  date: '',
  category: '',
  categoryCustom: '',
  amount: 0,
  note: ''
})

const filters = reactive({
  from: '',
  to: '',
  type: '',
  q: ''
})

const filtered = computed(() => {
  const q = filters.q.trim().toLowerCase()
  return entries.value.filter((e) => {
    if (filters.type && e.type !== filters.type) return false
    if (filters.from && e.date < filters.from) return false
    if (filters.to && e.date > filters.to) return false
    if (q) {
      const hay = `${e.category} ${e.note}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
})

const summary = computed(() => summarize(filtered.value))

function reload() {
  entries.value = getEntries()
}

function resetForm() {
  editingId.value = ''
  form.type = 'expense'
  form.category = expenseCategories[0]
  form.categoryCustom = ''
  isCustomCategory.value = false
  form.amount = 0
  form.note = ''
  const now = new Date()
  form.date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function onCategoryPresetChange() {
  if (form.category === '__custom__') {
    isCustomCategory.value = true
    form.categoryCustom = ''
  } else {
    isCustomCategory.value = false
    form.categoryCustom = ''
  }
}

watch(
  () => form.type,
  () => {
    // 프리셋을 유지 중이면 타입 변경 시 카테고리도 해당 타입의 첫 값으로 정리
    if (!isCustomCategory.value) {
      const list = presetCategories.value
      if (!list.includes(form.category)) {
        form.category = list[0]
      }
    }
  }
)

async function onSubmit() {
  error.value = ''
  busy.value = true
  try {
    await new Promise((r) => setTimeout(r, 450))
    const submitCategory = isCustomCategory.value ? form.categoryCustom : form.category
    if (!submitCategory || !String(submitCategory).trim()) {
      throw new Error('카테고리를 입력해주세요.')
    }
    if (editingId.value) {
      updateEntry(editingId.value, { ...form, category: submitCategory })
    } else {
      addEntry({ ...form, category: submitCategory })
    }
    reload()
    resetForm()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '저장에 실패했습니다.'
  } finally {
    busy.value = false
  }
}

function startEdit(e) {
  editingId.value = e.id
  form.type = e.type
  form.date = e.date
  if (e.type === 'income' ? incomeCategories.includes(e.category) : expenseCategories.includes(e.category)) {
    isCustomCategory.value = false
    form.category = e.category
    form.categoryCustom = ''
  } else {
    isCustomCategory.value = true
    form.category = '__custom__'
    form.categoryCustom = e.category
  }
  form.amount = e.amount
  form.note = e.note
}

function cancelEdit() {
  resetForm()
}

async function onDelete(e) {
  if (!confirm('삭제할까요?')) return
  busy.value = true
  try {
    await new Promise((r) => setTimeout(r, 350))
    deleteEntry(e.id)
    reload()
    if (editingId.value === e.id) resetForm()
  } finally {
    busy.value = false
  }
}

async function onClearAll() {
  if (!confirm('전체 데이터를 삭제할까요?')) return
  busy.value = true
  try {
    await new Promise((r) => setTimeout(r, 400))
    clearAll()
    reload()
    resetForm()
  } finally {
    busy.value = false
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

onMounted(() => {
  resetForm()
  reload()
})
</script>

<style scoped>
.table > :not(caption) > * > * {
  padding-top: 0.85rem;
  padding-bottom: 0.85rem;
}
</style>

