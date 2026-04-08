# 국민은행 가계부 (Demo)

Vue 3 + Composition API + Vue Router + Bootstrap 기반의 **로그인/회원가입 SPA** 예시입니다.  
기본 테마 색상은 **오렌지**이며, 제출/전환 시 **로딩 스피너 오버레이**가 표시됩니다.

## 실행 방법

```bash
npm install
npm run api
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## json-server API

- **실행**: `npm run api` (기본 포트: `3001`)
- **DB 파일**: `server/db.json`
- **리소스**
  - `GET/POST`: `/members`
  - `GET/POST`: `/ledgerEntries`
  - `GET/PUT/DELETE`: `/members/:id`, `/ledgerEntries/:id`
  - **사용자별 조회 예시**: `/ledgerEntries?memberId=1&_sort=date&_order=desc`

## Pinia 스토어(연동 코드)

- `src/stores/members.js`: 회원가입/로그인/로그아웃 + 세션(localStorage)
- `src/stores/account.js`: 로그인 사용자 기준 가계부 CRUD

## 화면 구성

- **Layout**: `header` / `content` / `footer`
- **Header 로고(이미지) 클릭**
  - 현재 화면이 로그인(`/login`)이면 회원가입(`/signup`)으로 전환
  - 그 외에는 로그인(`/login`)으로 전환
- **회원가입 완료 후**
  - 로그인 화면(`/login`)으로 자동 전환
- **로그인 완료 후**
  - 로그인 성공 화면(`/login-success`)으로 이동

## 가계부 / 대시보드

- **가계부(`/ledger`)**
  - 수입/지출 추가, 수정, 삭제
  - 기간/구분/검색 필터
  - 데이터는 `localStorage`에 저장
- **대시보드(`/dashboard`)**
  - KPI 3개: 총 수입 / 총 지출 / 순이익
  - 차트 3개: 월별 지출(Bar), 지출 카테고리(Doughnut), 월별 수입·지출(Line)
  - Chart.js 사용
- **아이콘**
  - Font Awesome(`@fortawesome/fontawesome-free`) 사용
